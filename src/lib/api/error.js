/**
 * API Error Handling
 * 
 * Provides standardized error handling for API routes
 */

/**
 * Custom API Error class
 * @extends Error
 */
export class APIError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} [statusCode=500] - HTTP status code
   * @param {string} [code='INTERNAL_SERVER_ERROR'] - Error code
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'APIError'
  }
}

/**
 * Standard error codes
 * @enum {string}
 */
export const ErrorCodes = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
}

/**
 * Create a new API error
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {string} [code='INTERNAL_SERVER_ERROR'] - Error code
 * @returns {APIError} New API error instance
 */
function createError(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
  return new APIError(message, statusCode, code)
}

/**
 * Error factory functions
 */
export const Errors = {
  /**
   * Create a bad request error
   * @param {string} message - Error message
   * @returns {APIError} Bad request error
   */
  badRequest(message) {
    return createError(message, 400, ErrorCodes.BAD_REQUEST)
  },

  /**
   * Create an unauthorized error
   * @param {string} [message='Unauthorized'] - Error message
   * @returns {APIError} Unauthorized error
   */
  unauthorized(message = 'Unauthorized') {
    return createError(message, 401, ErrorCodes.UNAUTHORIZED)
  },

  /**
   * Create a forbidden error
   * @param {string} [message='Forbidden'] - Error message
   * @returns {APIError} Forbidden error
   */
  forbidden(message = 'Forbidden') {
    return createError(message, 403, ErrorCodes.FORBIDDEN)
  },

  /**
   * Create a not found error
   * @param {string} [message='Resource not found'] - Error message
   * @returns {APIError} Not found error
   */
  notFound(message = 'Resource not found') {
    return createError(message, 404, ErrorCodes.NOT_FOUND)
  },

  /**
   * Create a conflict error
   * @param {string} message - Error message
   * @returns {APIError} Conflict error
   */
  conflict(message) {
    return createError(message, 409, ErrorCodes.CONFLICT)
  },

  /**
   * Create an internal server error
   * @param {string} [message='Internal server error'] - Error message
   * @returns {APIError} Internal server error
   */
  internal(message = 'Internal server error') {
    return createError(message, 500, ErrorCodes.INTERNAL_SERVER_ERROR)
  },

  /**
   * Create a service unavailable error
   * @param {string} [message='Service unavailable'] - Error message
   * @returns {APIError} Service unavailable error
   */
  serviceUnavailable(message = 'Service unavailable') {
    return createError(message, 503, ErrorCodes.SERVICE_UNAVAILABLE)
  }
}

/**
 * Format error response for API
 * @param {APIError} error - API error to format
 * @returns {Object} Formatted error response
 */
export function formatErrorResponse(error) {
  return {
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    }
  }
}

/**
 * Error handler middleware for API routes
 * @param {Function} handler - Route handler function
 * @returns {Function} Wrapped handler with error handling
 */
export async function withErrorHandler(handler) {
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
