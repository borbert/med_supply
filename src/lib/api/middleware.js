/**
 * API Middleware
 * 
 * Provides middleware functions for API routes including
 * authentication, authorization, and request handling
 */

import { NextRequest } from 'next/server'
import { Errors } from './error'
import { UserAccess } from '../models/data-access'

/**
 * Authentication middleware
 * @param {NextRequest} request - Next.js request object
 * @param {Function} handler - Route handler function
 * @returns {Promise<Response>} Response object
 */
export async function withAuth(request, handler) {
  try {
    // TODO: Implement proper authentication
    // For MVP, we'll create a mock authenticated user
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      role: 'admin',
      clinicId: '1'
    }

    // Add mock user to request
    request.user = mockUser

    return await handler(request)
  } catch (error) {
    console.error('Auth error:', error)
    return new Response(JSON.stringify({ error: 'Authentication error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * Role-based authorization middleware
 * @param {string|string[]} allowedRoles - Allowed roles
 * @returns {Function} Middleware function
 */
export function withRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  
  return async function(request, handler) {
    const { user } = request
    if (!user) {
      throw new Errors.unauthorized()
    }

    if (!roles.includes(user.role.toUpperCase())) {
      throw new Errors.forbidden('Insufficient permissions')
    }

    return await handler(request)
  }
}

/**
 * Clinic authorization middleware
 * @param {NextRequest} request - Next.js request object
 * @param {string} clinicId - Clinic ID
 * @param {Function} handler - Route handler function
 * @returns {Promise<Response>} Response object
 */
export function withClinic(request, clinicId, handler) {
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

/**
 * Method restriction middleware
 * @param {string|string[]} allowedMethods - Allowed HTTP methods
 * @returns {Function} Middleware function
 */
export function withMethods(allowedMethods) {
  const methods = Array.isArray(allowedMethods) ? allowedMethods : [allowedMethods]
  
  return async function(request, handler) {
    if (!methods.includes(request.method)) {
      throw new Errors.methodNotAllowed()
    }

    return await handler(request)
  }
}

/**
 * Parse request body
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<Object>} Parsed body
 */
export async function parseRequestBody(request) {
  try {
    return await request.json()
  } catch (error) {
    throw new Errors.badRequest('Invalid request body')
  }
}

/**
 * Parse query parameters
 * @param {NextRequest} request - Next.js request object
 * @returns {Object} Query parameters
 */
export function parseQueryParams(request) {
  const url = new URL(request.url)
  const params = {}
  url.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

/**
 * Parse pagination parameters
 * @param {Object} params - Query parameters
 * @param {number} [defaultLimit=10] - Default limit
 * @returns {Object} Pagination parameters
 */
export function parsePaginationParams(params, defaultLimit = 10) {
  const page = Math.max(1, parseInt(params.page) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(params.limit) || defaultLimit))
  return { page, limit }
}
