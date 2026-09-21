import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import JSZip from 'jszip';

// Helper para determinar extensão por Content-Type
function getExtensionFromMime(mime: string, fallback: string): string {
  if (mime.includes('image/jpeg') || mime.includes('image/jpg')) return 'jpg';
  if (mime.includes('image/png')) return 'png';
  if (mime.includes('image/webp')) return 'webp';
  if (mime.includes('image/svg')) return 'svg';
  if (mime.includes('image/gif')) return 'gif';
  if (mime.includes('image/x-icon') || mime.includes('image/vnd.microsoft.icon')) return 'ico';
  return fallback;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let targetUrl = (body.url || '').trim();

    if (!targetUrl) {
      return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: 'URL inválida ou malformada' }, { status: 400 });
    }

    // 1. Fetch da página original
    let response: Response;
    try {
      response = await fetch(parsedUrl.href, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        redirect: 'follow',
      });
    } catch (fetchErr: any) {
      return NextResponse.json(
        { error: `Não foi possível conectar ao site: ${fetchErr?.message || 'Erro de rede'}` },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `O site retornou erro ${response.status} (${response.statusText || 'Não autorizado'})` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const zip = new JSZip();

    // 2. Limpeza de rastreadores (preservando VSL e scripts essenciais)
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
    ];

    $('script').each((_, el) => {
      const src = ($(el).attr('src') || '').toLowerCase();
      const content = ($(el).html() || '').toLowerCase();

      const isVideoPlayer =
        src.includes('converteai') ||
        src.includes('vturb') ||
        src.includes('pandavideo') ||
        src.includes('youtube') ||
        src.includes('vimeo') ||
        src.includes('wistia') ||
        content.includes('smartplayer') ||
        content.includes('pandavideo');

      if (isVideoPlayer) return;

      const isTracker = trackerPatterns.some((p) => src.includes(p) || content.includes(p));
      if (isTracker) $(el).remove();
    });

    $('noscript').each((_, el) => {
      const content = ($(el).html() || '').toLowerCase();
      if (content.includes('facebook.com/tr') || content.includes('googletagmanager')) {
        $(el).remove();
      }
    });

    // 3. Criar pastas no ZIP
    const cssFolder = zip.folder('css');
    const imagesFolder = zip.folder('images');

    // 4. Baixar folhas de estilo CSS externas
    const cssLinks = $('link[rel="stylesheet"]').toArray();
    let cssCount = 0;

    for (let i = 0; i < cssLinks.length; i++) {
      const el = cssLinks[i];
      const href = $(el).attr('href');
      if (!href) continue;

      try {
        const fullCssUrl = new URL(href, parsedUrl.href).href;
        const cssRes = await fetch(fullCssUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(6000),
        });

        if (cssRes.ok) {
          const cssText = await cssRes.text();
          const filename = `style_${cssCount + 1}.css`;
          if (cssFolder) {
            cssFolder.file(filename, cssText);
          }
          // Atualiza o link no HTML para o caminho relativo local
          $(el).attr('href', `css/${filename}`);
          cssCount++;
        }
      } catch (err) {
        // Se falhar o download individual, mantém o link absoluto
        try {
          $(el).attr('href', new URL(href, parsedUrl.href).href);
        } catch {}
      }
    }

    // 5. Baixar imagens
    const imageElements = $('img').toArray();
    let imgCount = 0;
    const downloadedUrls = new Map<string, string>(); // url original -> caminho local

    for (let i = 0; i < Math.min(imageElements.length, 60); i++) {
      const el = imageElements[i];
      let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (!src) continue;

      // Ignora imagens embutidas em base64
      if (src.startsWith('data:')) continue;

      try {
        const fullImgUrl = new URL(src, parsedUrl.href).href;

        // Se já baixou esta mesma imagem antes, reutiliza o caminho
        if (downloadedUrls.has(fullImgUrl)) {
          const localPath = downloadedUrls.get(fullImgUrl)!;
          $(el).attr('src', localPath);
          $(el).removeAttr('srcset');
          $(el).removeAttr('data-src');
          $(el).removeAttr('data-lazy-src');
          continue;
        }

        const imgRes = await fetch(fullImgUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Referer': parsedUrl.href,
          },
          signal: AbortSignal.timeout(6000),
        });

        if (imgRes.ok) {
          const contentType = imgRes.headers.get('content-type') || '';
          // Determina extensão
          let ext = 'png';
          try {
            const urlPath = new URL(fullImgUrl).pathname;
            const match = urlPath.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/i);
            if (match && match[1]) {
              ext = match[1].toLowerCase().replace('jpeg', 'jpg');
            } else {
              ext = getExtensionFromMime(contentType, 'png');
            }
          } catch {
            ext = getExtensionFromMime(contentType, 'png');
          }

          const arrayBuffer = await imgRes.arrayBuffer();
          const filename = `image_${imgCount + 1}.${ext}`;
          const localPath = `images/${filename}`;

          if (imagesFolder) {
            imagesFolder.file(filename, Buffer.from(arrayBuffer));
          }

          downloadedUrls.set(fullImgUrl, localPath);
          $(el).attr('src', localPath);
          $(el).removeAttr('srcset');
          $(el).removeAttr('data-src');
          $(el).removeAttr('data-lazy-src');
          imgCount++;
        }
      } catch (err) {
        // Se falhar o download individual, mantém o link absoluto
        try {
          $(el).attr('src', new URL(src, parsedUrl.href).href);
        } catch {}
      }
    }

    // 6. Favicon
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').first();
    const favHref = favicon.attr('href');
    if (favHref && !favHref.startsWith('data:')) {
      try {
        const fullFavUrl = new URL(favHref, parsedUrl.href).href;
        const favRes = await fetch(fullFavUrl, { signal: AbortSignal.timeout(4000) });
        if (favRes.ok) {
          const favBuffer = await favRes.arrayBuffer();
          if (imagesFolder) {
            imagesFolder.file('favicon.ico', Buffer.from(favBuffer));
          }
          favicon.attr('href', 'images/favicon.ico');
        }
      } catch {}
    }

    // 7. Remove tag base para não forçar links remotos no arquivo offline
    $('base').remove();

    // Injeta charset e viewport se não existirem
    const head = $('head');
    if ($('meta[charset]').length === 0) {
      head.prepend('<meta charset="UTF-8">');
    }

    const pageTitle = $('title').text().trim() || parsedUrl.hostname;
    const finalHtml = $.html();

    // Adiciona o index.html principal ao ZIP
    zip.file('index.html', finalHtml);

    // Adiciona README explicativo
    const readmeContent = `=====================================================
PACOTE DE PÁGINA CLONADA - FLUXOOFFER
=====================================================
Página Original: ${parsedUrl.href}
Título: ${pageTitle}
Data de Clonagem: ${new Date().toLocaleString('pt-BR')}
CSS Baixados: ${cssCount}
Imagens Baixadas: ${imgCount}

COMO USAR ESTA PÁGINA:
1. Abra o arquivo 'index.html' no seu navegador ou editor de código.
2. Todos os estilos e imagens foram salvos localmente nas pastas 'css/' e 'images/'.
3. Para colocar no ar:
   - Envie todos os arquivos e pastas para sua hospedagem (WordPress, Hostinger, Vercel, Cloudflare Pages ou cPanel).
4. IMPORTANTE: Altere os botões de compra/checkout para o seu link próprio!
=====================================================`;
    zip.file('LEIA-ME.txt', readmeContent);

    // Gera o arquivo ZIP binário
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    const sanitizedTitle = (pageTitle || 'pagina-clonada')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 35);

    const zipFilename = `${sanitizedTitle}-${Date.now()}.zip`;

    return new Response(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
        'X-Downloaded-Images': String(imgCount),
        'X-Downloaded-Css': String(cssCount),
      },
    });
  } catch (error: any) {
    console.error('Erro ao gerar ZIP da página:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro interno ao empacotar página em ZIP' },
      { status: 500 }
    );
  }
}
