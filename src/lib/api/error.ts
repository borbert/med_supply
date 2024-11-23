/**
 * API Error Handling
 * 
 * Provides standardized error handling for API routes
 */

export class APIError extends Error {
  public statusCode: number
  public code: string

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_SERVER_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'APIError'
  }
}

export const ErrorCodes = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const

export function createError(
  message: string,
  statusCode: number = 500,
  code: keyof typeof ErrorCodes = 'INTERNAL_SERVER_ERROR'
): APIError {
  return new APIError(message, statusCode, code)
}

// Common error creators
export const Errors = {
  badRequest: (message: string) => createError(message, 400, 'BAD_REQUEST'),
  unauthorized: (message: string = 'Unauthorized') => createError(message, 401, 'UNAUTHORIZED'),
  forbidden: (message: string = 'Forbidden') => createError(message, 403, 'FORBIDDEN'),
  notFound: (message: string = 'Resource not found') => createError(message, 404, 'NOT_FOUND'),
  conflict: (message: string) => createError(message, 409, 'CONFLICT'),
  internal: (message: string = 'Internal server error') => createError(message, 500, 'INTERNAL_SERVER_ERROR'),
  serviceUnavailable: (message: string = 'Service unavailable') => createError(message, 503, 'SERVICE_UNAVAILABLE')
}

export type ErrorResponse = {
  error: {
    message: string
    code: string
    statusCode: number
  }
}

export function formatErrorResponse(error: APIError): ErrorResponse {
  return {
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    }
  }
}

// Error handler middleware for API routes
export async function withErrorHandler(
  handler: () => Promise<any>
): Promise<Response> {
  try {
    const result = await handler()
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof APIError) {
      return new Response(
        JSON.stringify(formatErrorResponse(error)),
        {
          status: error.statusCode,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const internalError = Errors.internal()
    return new Response(
      JSON.stringify(formatErrorResponse(internalError)),
      {
        status: internalError.statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
