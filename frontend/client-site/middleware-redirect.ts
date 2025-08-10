import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  if (url.pathname === '/sign-up' || url.pathname === '/sign-in') {
    url.pathname = `/auth${url.pathname}`;
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/sign-up', '/sign-in']
};
