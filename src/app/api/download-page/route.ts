import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
    }

    // 1. Fazer o fetch da página original
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Falha ao acessar a URL fornecida' }, { status: response.status });
    }

    const html = await response.text();

    // 2. Limpar o HTML usando cheerio
    const $ = cheerio.load(html);

    // Remover todos os scripts e pixels comuns
    $('script').remove();
    $('noscript').remove();
    // Remover iframes escondidos que podem ser pixels de rastreamento, mantendo os de vídeo (youtube, vimeo)
    $('iframe').each((i, el) => {
      const src = $(el).attr('src') || '';
      if (!src.includes('youtube') && !src.includes('vimeo') && !src.includes('wistia') && !src.includes('panda')) {
        $(el).remove();
      }
    });

    // Injetar uma base tag para que caminhos relativos ainda funcionem (opcional)
    const baseUrl = new URL(url).origin;
    $('head').prepend(`<base href="${baseUrl}/">`);

    const cleanedHtml = $.html();

    // 3. (Futuro) Salvar no Banco de Dados (Prisma)
    // await prisma.pageClone.create({ data: { originalUrl: url, html: cleanedHtml } })

    return NextResponse.json({ success: true, html: cleanedHtml });

  } catch (error) {
    console.error('Erro ao baixar página:', error);
    return NextResponse.json({ error: 'Erro interno no servidor ao tentar processar a página' }, { status: 500 });
  }
}
