import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const customKey = (formData.get('apiKey') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const apiKey = customKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          needsApiKey: true,
          error:
            'Para transcrição em segundo plano via Whisper da OpenAI, informe sua API Key da OpenAI ou utilize o modo de Reprodução com Reconhecimento de Voz do navegador (100% gratuito).',
        },
        { status: 400 }
      );
    }

    // Prepara payload para a API da OpenAI Whisper
    const openAiFormData = new FormData();
    openAiFormData.append('file', file, file.name);
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

    if (!whisperRes.ok) {
      const errJson = await whisperRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errJson?.error?.message ||
            `Erro na OpenAI Whisper: status ${whisperRes.status} (${whisperRes.statusText})`,
        },
        { status: whisperRes.status }
      );
    }

    const whisperData = await whisperRes.json();

    return NextResponse.json({
      success: true,
      transcript: whisperData.text || '',
      duration: whisperData.duration || 0,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error('Erro ao transcrever arquivo:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro interno ao processar o arquivo de vídeo.' },
      { status: 500 }
    );
  }
}
