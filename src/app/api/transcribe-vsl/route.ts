import { NextResponse } from 'next/server';

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export async function POST(request: Request) {
  try {
    const { url, rawText } = await request.json();

    // Se o usuário enviou texto bruto diretamente para estruturar
    if (rawText && typeof rawText === 'string' && rawText.trim().length > 0) {
      return NextResponse.json({
        success: true,
        type: 'text',
        title: 'Transcrição Inserida',
        transcript: rawText.trim(),
      });
    }

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL do vídeo ou áudio é obrigatória.' }, { status: 400 });
    }

    const videoId = extractYouTubeId(url);

    if (videoId) {
      // 1. Tentar obter transcrição do YouTube via captionTracks
      const videoPageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      });

      if (!videoPageRes.ok) {
        return NextResponse.json(
          { error: 'Não foi possível acessar a página do vídeo no YouTube.' },
          { status: 502 }
        );
      }

      const html = await videoPageRes.text();

      // Extrai título do vídeo
      let videoTitle = 'Vídeo do YouTube';
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      if (titleMatch && titleMatch[1]) {
        videoTitle = titleMatch[1].replace('- YouTube', '').trim();
      }

      // Procura captionTracks no payload ytInitialPlayerResponse
      const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});(?:var|\n|<\/script>)/);
      let captionTracks: any[] = [];

      if (playerResponseMatch && playerResponseMatch[1]) {
        try {
          const playerResponse = JSON.parse(playerResponseMatch[1]);
          captionTracks =
            playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
        } catch {}
      }

      // Fallback: procura diretamente por baseUrl de legendas
      if (captionTracks.length === 0) {
        const regexTracks = /"captionTracks":\s*(\[.*?\])/;
        const match = html.match(regexTracks);
        if (match && match[1]) {
          try {
            captionTracks = JSON.parse(match[1]);
          } catch {}
        }
      }

      if (captionTracks && captionTracks.length > 0) {
        // Prioriza pt-BR, pt, ou pega a primeira legenda disponível
        const track =
          captionTracks.find((t: any) => t.languageCode === 'pt' || t.languageCode === 'pt-BR') ||
          captionTracks[0];

        if (track && track.baseUrl) {
          const captionRes = await fetch(track.baseUrl);
          const captionXml = await captionRes.text();

          // Converte XML de legenda para texto corrido limpo
          const textMatches = captionXml.matchAll(/<text[^>]*>(.*?)<\/text>/g);
          const sentences: string[] = [];

          for (const match of textMatches) {
            let sentence = match[1] || '';
            // Decodifica entidades HTML
            sentence = sentence
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/\n/g, ' ')
              .trim();

            if (sentence) {
              sentences.push(sentence);
            }
          }

          const fullTranscript = sentences.join(' ');

          if (fullTranscript.length > 0) {
            return NextResponse.json({
              success: true,
              type: 'youtube',
              title: videoTitle,
              url,
              transcript: fullTranscript,
              language: track.languageCode || 'pt',
            });
          }
        }
      }

      return NextResponse.json({
        success: false,
        error:
          'Este vídeo do YouTube não possui legendas automáticas públicas ativadas pelo canal. Utilize a aba "Gravar/Falar Áudio" ou cole o roteiro bruto para estruturá-lo.',
      });
    }

    return NextResponse.json({
      error:
        'URL não suportada para extração automática direta. Utilize links do YouTube ou insira o áudio/roteiro na aba correspondente.',
    });
  } catch (error: any) {
    console.error('Erro na transcrição de VSL:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao processar transcrição.' },
      { status: 500 }
    );
  }
}
