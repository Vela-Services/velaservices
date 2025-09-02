import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  { prefix: '/provider', allowedRoles: ['provider'] },
  { prefix: '/customer', allowedRoles: ['customer'] },
];

// Helper to get cookie value in a robust way (handles case-insensitivity)
function getCookie(req: NextRequest, name: string): string | undefined {
  // Next.js cookies are case-sensitive, but browser may send lowercase
  // Try both
  return req.cookies.get(name)?.value || req.cookies.get(name.toLowerCase())?.value;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Get role from cookie
  const role = getCookie(req, 'role');

  // If no protected route matches, allow
  const route = protectedRoutes.find((r) => path.startsWith(r.prefix));
  if (!route) return NextResponse.next();

  // If no role cookie, redirect to login
  if (!role) {
    // Optionally, you can append a redirect param to return after login
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // If role is not allowed, redirect to unauthorized
  if (!route.allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // All good, continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/provider/:path*', '/customer/:path*'],
};
