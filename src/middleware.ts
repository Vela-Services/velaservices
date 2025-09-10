import { NextRequest, NextResponse } from 'next/server';

// Define which routes require which roles
const protectedRoutes = [
  { matcher: /^\/provider(\/|$)/, allowedRoles: ['provider'] },
  { matcher: /^\/dashboard(\/|$)/, allowedRoles: ['provider'] },
  { matcher: /^\/providerFaq(\/|$)/, allowedRoles: ['provider'] },
  { matcher: /^\/providerServices(\/|$)/, allowedRoles: ['provider'] },
  { matcher: /^\/customer(\/|$)/, allowedRoles: ['customer'] },
  { matcher: /^\/customerServices(\/|$)/, allowedRoles: ['customer'] },
  { matcher: /^\/orders(\/|$)/, allowedRoles: ['customer'] },
  { matcher: /^\/payment(\/|$)/, allowedRoles: ['customer'] },
  { matcher: /^\/cart(\/|$)/, allowedRoles: ['customer'] },
];

// Helper to get cookie value robustly
function getCookie(req: NextRequest, name: string): string | undefined {
  // Try both original and lowercase
  return req.cookies.get(name)?.value || req.cookies.get(name.toLowerCase())?.value;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Find the first protected route that matches the current path
  const route = protectedRoutes.find((r) => r.matcher.test(path));
  if (!route) {
    // Not a protected route, allow
    return NextResponse.next();
  }

  // Get role from cookie
  const role = getCookie(req, 'role');

  // If no role, redirect to login with redirect param
  if (!role) {
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

// Match all relevant routes for both /provider and /customer
export const config = {
  matcher: [
    '/provider/:path*',
    '/dashboard/:path*',
    '/providerFaq/:path*',
    '/providerServices/:path*',
    '/customer/:path*',
    '/customerServices/:path*',
    '/orders/:path*',
    '/payment/:path*',
    '/cart/:path*',
  ],
};
