/**
 * API Middleware
 * 
 * Provides middleware functions for API routes including
 * authentication, authorization, and request handling
 */

import { NextRequest } from 'next/server'
import { Errors } from './error'
import { UserAccess } from '../models/data-access'

// Types
export type AuthenticatedRequest = NextRequest & {
  user: {
    id: string
    email: string
    role: string
    clinicId?: string
  }
}

// Authentication middleware
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<Response>
): Promise<Response> {
  try {
    // TODO: Implement proper authentication
    // For MVP, we'll create a mock authenticated user
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'admin',
      clinicId: '1'
    }

    // Cast the request to include our mock user
    const authedRequest = request as AuthenticatedRequest
    authedRequest.user = mockUser

    return await handler(authedRequest)
  } catch (error) {
    console.error('Auth error:', error)
    return new Response(JSON.stringify({ error: 'Authentication error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Role-based authorization middleware
export function withRole(roles: string[]) {
  return async function (
    request: AuthenticatedRequest,
    handler: (req: AuthenticatedRequest) => Promise<Response>
  ): Promise<Response> {
    // TODO: Implement proper role checking
    // For MVP, we'll allow all requests through
    return await handler(request)

    /* Original role checking code:
    if (!roles.includes(request.user.role)) {
      throw Errors.forbidden('Insufficient permissions')
    }
    return await handler(request)
    */
  }
}

// Clinic authorization middleware
export function withClinic(
  request: AuthenticatedRequest,
  clinicId: string,
  handler: (req: AuthenticatedRequest) => Promise<Response>
): Promise<Response> {
  // TODO: Implement proper clinic authorization
  // For MVP, we'll allow all requests through
  return handler(request)

  /* Original clinic authorization code:
  if (request.user.role !== 'ADMIN' && request.user.clinicId !== clinicId) {
    throw Errors.forbidden('Access denied to this clinic')
  }
  return handler(request)
  */
}

// Method handler middleware
export type MethodHandlers = {
  GET?: (req: AuthenticatedRequest) => Promise<Response>
  POST?: (req: AuthenticatedRequest) => Promise<Response>
  PUT?: (req: AuthenticatedRequest) => Promise<Response>
  DELETE?: (req: AuthenticatedRequest) => Promise<Response>
  PATCH?: (req: AuthenticatedRequest) => Promise<Response>
}

export async function withMethods(
  request: AuthenticatedRequest,
  handlers: MethodHandlers
): Promise<Response> {
  const method = request.method as keyof MethodHandlers
  const handler = handlers[method]

  if (!handler) {
    throw Errors.badRequest(`Method ${method} not allowed`)
  }

  return handler(request)
}

// Request body parser
export async function parseRequestBody<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json()
  } catch (error) {
    throw Errors.badRequest('Invalid request body')
  }
}

// Query params parser
export function parseQueryParams(request: NextRequest): URLSearchParams {
  const url = new URL(request.url)
  return url.searchParams
}

// Pagination params parser
export interface PaginationParams {
  page: number
  limit: number
}

export function parsePaginationParams(
  params: URLSearchParams,
  defaultLimit: number = 10
): PaginationParams {
  const page = Math.max(1, Number(params.get('page')) || 1)
  const limit = Math.max(1, Number(params.get('limit')) || defaultLimit)
  return { page, limit }
}
