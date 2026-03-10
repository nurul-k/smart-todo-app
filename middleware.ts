import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - no protection needed
  if (
    pathname === '/' ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // For protected routes, we'll rely on the page components to handle auth
  // since loading auth() in raw middleware can cause issues
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
