import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

// NOTE: Middleware route protection is a UX-layer client redirect only.
// The backend server is the actual source of truth and will reject any API request
// with an invalid or expired JWT token regardless of what middleware allows through.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('fixitnow_session')?.value;

  // Protect all /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Decode JWT payload (payload contains { userId, role })
      const payload = decodeJwt(sessionToken) as { userId?: string; role?: string };
      const userRole = (payload?.role || '').toUpperCase();

      const roleDashboardMap: Record<string, string> = {
        CUSTOMER: '/dashboard/customer',
        TECHNICIAN: '/dashboard/technician',
        ADMIN: '/dashboard/admin',
      };

      const userDefaultDashboard = roleDashboardMap[userRole] || '/dashboard/customer';

      // Check role matching for specific dashboard sub-routes
      if (pathname.startsWith('/dashboard/customer') && userRole !== 'CUSTOMER') {
        return NextResponse.redirect(new URL(userDefaultDashboard, request.url));
      }

      if (pathname.startsWith('/dashboard/technician') && userRole !== 'TECHNICIAN') {
        return NextResponse.redirect(new URL(userDefaultDashboard, request.url));
      }

      if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL(userDefaultDashboard, request.url));
      }
    } catch {
      // If token is malformed, redirect to login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
