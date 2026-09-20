import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let targetUrl = (body.url || '').trim();

    if (!targetUrl) {
      return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
    }

    // Normaliza URL adicionando https:// se necessário
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: 'URL inválida ou malformada' }, { status: 400 });
    }

    // 1. Fetch da página original com User-Agent moderno e headers realistas
    let response: Response;
    try {
      response = await fetch(parsedUrl.href, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        redirect: 'follow',
      });
    } catch (fetchErr: any) {
      return NextResponse.json(
        {
          error: `Não foi possível conectar ao site: ${fetchErr?.message || 'Erro de rede'}`,
        },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `O site retornou status ${response.status} (${response.statusText || 'Não autorizado/Não encontrado'})`,
        },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 2. Limpeza inteligente e direcionada:
    // Remove APENAS scripts de rastreamento (pixels, analytics), PRESERVANDO scripts essenciais de vídeo, sliders e delays!
    const trackerPatterns = [
      'fbevents.js',
      'connect.facebook.net',
      'fbq(',
      'googletagmanager.com',
      'google-analytics.com',
      'analytics.tiktok.com',
      'ttq.',
      'hotjar.com',
      'clarity.ms',
      'utmify',
      'pixel',
      'tracking',
      'beacon',
    ];

    $('script').each((_, el) => {
      const src = ($(el).attr('src') || '').toLowerCase();
      const content = ($(el).html() || '').toLowerCase();

      // Checa se o script é de vídeo (preserva sempre!)
      const isVideoPlayer =
        src.includes('converteai') ||
        src.includes('vturb') ||
        src.includes('pandavideo') ||
        src.includes('youtube') ||
        src.includes('vimeo') ||
        src.includes('wistia') ||
        content.includes('smartplayer') ||
        content.includes('pandavideo');

      if (isVideoPlayer) {
        return; // Preserva o player de VSL!
      }

      const isTracker = trackerPatterns.some(
        (p) => src.includes(p) || content.includes(p)
      );

      if (isTracker) {
        $(el).remove();
      }
    });

    // Remove noscript de trackers conhecidos
    $('noscript').each((_, el) => {
      const content = ($(el).html() || '').toLowerCase();
      if (
        content.includes('facebook.com/tr') ||
        content.includes('googletagmanager') ||
        content.includes('pixel')
      ) {
        $(el).remove();
      }
    });

    // Remove iframes suspeitos mantendo players de vídeo
    $('iframe').each((_, el) => {
      const src = ($(el).attr('src') || '').toLowerCase();
      const isVideo =
        src.includes('youtube') ||
        src.includes('vimeo') ||
        src.includes('wistia') ||
        src.includes('panda') ||
        src.includes('converteai') ||
        src.includes('vturb');

      if (!isVideo && (src.includes('pixel') || src.includes('tag') || src.includes('track'))) {
        $(el).remove();
      }
    });

    // 3. Normalização de caminhos relativos
    const baseUrl = parsedUrl.origin;

    // Converter links relativos de imagens para absolutos
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('//')) {
        try {
          const abs = new URL(src, parsedUrl.href).href;
          $(el).attr('src', abs);
        } catch {}
      }
    });

    // Injetar tags essenciais no <head>:
    // - <base> para recursos relativos de CSS e fontes
    // - <meta name="referrer" content="no-referrer"> para evitar bloqueio 403 Forbidden de imagens de CDNs externas
    const head = $('head');
    head.prepend(`<meta name="referrer" content="no-referrer">`);
    head.prepend(`<base href="${baseUrl}/">`);

    // Metadados extraídos da página
    const pageTitle = $('title').text().trim() || parsedUrl.hostname;
    const imagesCount = $('img').length;
    const videoLinks: string[] = [];

    $('iframe').each((_, el) => {
      const src = $(el).attr('src');
      if (src && (src.includes('youtube') || src.includes('vimeo') || src.includes('panda') || src.includes('vturb'))) {
        videoLinks.push(src);
      }
    });

    $('video source, video').each((_, el) => {
      const src = $(el).attr('src');
      if (src) videoLinks.push(src);
    });

    const cleanedHtml = $.html();

    return NextResponse.json({
      success: true,
      url: parsedUrl.href,
      title: pageTitle,
      html: cleanedHtml,
      sizeBytes: Buffer.byteLength(cleanedHtml, 'utf8'),
      imagesCount,
      videoLinks: Array.from(new Set(videoLinks)),
    });
  } catch (error: any) {
    console.error('Erro ao baixar página:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro interno no servidor ao tentar processar a página' },
      { status: 500 }
    );
  }
}
