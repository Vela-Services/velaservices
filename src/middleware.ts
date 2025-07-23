import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  { prefix: '/provider', allowedRoles: ['provider'] },
  { prefix: '/customer', allowedRoles: ['customer'] },
];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const role = req.cookies.get('role')?.value;

  const route = protectedRoutes.find((r) => path.startsWith(r.prefix));
  if (!route) return NextResponse.next();

  if (!role) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (!route.allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/provider/:path*', '/customer/:path*'],
};
