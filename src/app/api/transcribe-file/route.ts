import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

export const runtime = 'nodejs';
export const maxDuration = 60;

let cachedTranscriber: any = null;

async function getLocalTranscriber() {
  if (!cachedTranscriber) {
    const { pipeline } = await import('@xenova/transformers');
    cachedTranscriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
  }
  return cachedTranscriber;
}

function isWav(buffer: Buffer): boolean {
  return (
    buffer.length > 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WAVE'
  );
}

// Converte buffer de arquivo WAV 16-bit PCM em Float32Array normalizado para o Whisper
function wavToFloat32Array(buffer: Buffer): Float32Array {
  let dataOffset = 44;
  for (let i = 12; i < Math.min(buffer.length - 8, 200); i++) {
    if (
      buffer[i] === 0x64 && // 'd'
      buffer[i + 1] === 0x61 && // 'a'
      buffer[i + 2] === 0x74 && // 't'
      buffer[i + 3] === 0x61    // 'a'
    ) {
      dataOffset = i + 8;
      break;
    }
  }

  const sampleCount = Math.floor((buffer.length - dataOffset) / 2);
  if (sampleCount <= 0) return new Float32Array(0);

  const float32 = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    const int16 = buffer.readInt16LE(dataOffset + i * 2);
    float32[i] = int16 < 0 ? int16 / 32768.0 : int16 / 32767.0;
  }

  return float32;
}

// Fallback caso receba arquivo não-WAV direto (ex: MP4, WebM, MP3) no servidor
function convertMediaToWavBuffer(inputBuffer: Buffer, originalExt: string = '.mp4'): Buffer | null {
  const tempDir = os.tmpdir();
  const tempInput = path.join(tempDir, `vsl_in_${Date.now()}_${Math.random().toString(36).substring(7)}${originalExt}`);
  const tempOutput = path.join(tempDir, `vsl_out_${Date.now()}_${Math.random().toString(36).substring(7)}.wav`);

  try {
    fs.writeFileSync(tempInput, inputBuffer);
    execSync(`ffmpeg -y -i "${tempInput}" -ar 16000 -ac 1 -c:a pcm_s16le "${tempOutput}"`, {
      stdio: 'ignore',
      timeout: 30000,
    });

    if (fs.existsSync(tempOutput)) {
      const wavBuffer = fs.readFileSync(tempOutput);
      return wavBuffer;
    }
  } catch (err) {
    console.warn('Falha na conversão ffmpeg no servidor:', err);
  } finally {
    try {
      if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
      if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
    } catch {}
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const customKey = (formData.get('apiKey') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const apiKey = customKey || process.env.OPENAI_API_KEY;

    // 1. Se o usuário forneceu uma chave da OpenAI, utiliza a API na Nuvem
    if (apiKey) {
      try {
        const openAiFormData = new FormData();
        openAiFormData.append('file', file, file.name || 'audio.wav');
        openAiFormData.append('model', 'whisper-1');
        openAiFormData.append('language', 'pt');
        openAiFormData.append('response_format', 'verbose_json');

        const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: openAiFormData,
        });

        if (whisperRes.ok) {
          const whisperData = await whisperRes.json();
          return NextResponse.json({
            success: true,
            engine: 'openai-cloud',
            transcript: whisperData.text || '',
            duration: whisperData.duration || 0,
            fileName: file.name,
          });
        }
      } catch (cloudErr) {
        console.warn('Falha na OpenAI Cloud, caindo para motor Whisper local...', cloudErr);
      }
    }

    // 2. Modo Padrão Gratuito & Ilimitado: Motor de IA Whisper Local no Servidor
    const arrayBuffer = await file.arrayBuffer();
    let nodeBuffer: Buffer = Buffer.from(arrayBuffer) as any;

    // Se não for WAV, tenta converter com ffmpeg
    if (!isWav(nodeBuffer)) {
      const ext = path.extname(file.name || '') || '.mp4';
      const convertedWav = convertMediaToWavBuffer(nodeBuffer, ext);
      if (convertedWav) {
        nodeBuffer = convertedWav as any;
      }
    }

    // Extrai samples Float32
    const samples = wavToFloat32Array(nodeBuffer);

    if (samples.length === 0) {
      return NextResponse.json(
        { error: 'Não foi possível extrair amostras de áudio válidas deste arquivo. Verifique se o arquivo possui uma trilha de áudio válida.' },
        { status: 400 }
      );
    }

    const transcriber = await getLocalTranscriber();

    // Executa a transcrição com Whisper
    const result = await transcriber(samples, {
      language: 'portuguese',
      task: 'transcribe',
      chunk_length_s: 30,
      stride_length_s: 5,
    });

    const transcriptText = Array.isArray(result)
      ? result.map((r: any) => r.text).join(' ')
      : (result as any).text || '';

    const cleanTranscript = (transcriptText || '')
      .replace(/\[música\]/gi, '')
      .replace(/\[musica\]/gi, '')
      .replace(/\[silêncio\]/gi, '')
      .replace(/\[silencio\]/gi, '')
      .trim();

    if (!cleanTranscript && (!transcriptText || transcriptText.trim().length === 0)) {
      return NextResponse.json({
        success: false,
        error:
          'O motor de IA não identificou falas humanas claras no áudio deste vídeo. Verifique se o vídeo possui locução audível.',
      });
    }

    return NextResponse.json({
      success: true,
      engine: 'whisper-server-local',
      transcript: (cleanTranscript || transcriptText).trim(),
      fileName: file.name,
      sampleCount: samples.length,
    });
  } catch (error: any) {
    console.error('Erro ao transcrever arquivo de áudio:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro interno no servidor ao processar transcrição.' },
      { status: 500 }
    );
  }
}
