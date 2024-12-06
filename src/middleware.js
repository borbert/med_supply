/**
 * Next.js Middleware
 * 
 * This middleware is temporarily disabled for MVP.
 * TODO: Implement proper authentication checks.
 */

import { NextResponse } from 'next/server'

// Routes that don't require authentication
const publicRoutes = ['/login', '/signup']

export async function middleware(request) {
  // For MVP, allow all requests
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
