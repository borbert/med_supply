/**
 * Next.js Middleware
 * 
 * This middleware handles route protection and authentication.
 * It runs before any request is processed and can redirect
 * unauthenticated users to the login page.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const publicRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for access token in cookies first
  const accessToken = request.cookies.get('accessToken')?.value

  // Check authorization header
  const authHeader = request.headers.get('authorization')

  if (!accessToken && !authHeader?.startsWith('Bearer ')) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/inventory/:path*',
    '/orders/:path*',
    '/products/:path*',
    '/settings/:path*',
  ]
}
