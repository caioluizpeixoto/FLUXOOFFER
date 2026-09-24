import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Liberar a rota de login, rotas de API públicas (se houver, ex: api/auth) e arquivos estáticos
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') // Ignora arquivos como favicon, imagens, etc
  ) {
    return NextResponse.next();
  }

  // Verifica o cookie
  const authCookie = request.cookies.get('admin_auth');
  if (!authCookie || authCookie.value !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
