/**
 * Users API Routes
 * 
 * Handles CRUD operations for users
 */

import { NextRequest } from 'next/server'
import { withErrorHandler } from '@/lib/api/error'
import {
  withAuth,
  withRole,
  withMethods,
  parseRequestBody,
  parseQueryParams,
  parsePaginationParams,
  type AuthenticatedRequest
} from '@/lib/api/middleware'
import { UserAccess } from '@/lib/models/data-access'
import { UserSchema, UserUpdateSchema } from '@/lib/api/validation'
import { withValidation } from '@/lib/api/validation'
import { User } from '@/lib/models/types'; // Ensure you import the User type

// GET /api/users
async function getUsers(req: AuthenticatedRequest): Promise<Response> {
  const params = parseQueryParams(req)
  const { page, limit } = parsePaginationParams(params)

  let users = []
  if (req.user.role === 'admin') {
    // Admins can see all users
    users = await UserAccess.getAll()
  } else {
    // Non-admins can only see users from their clinic
    users = await UserAccess.getByClinic(req.user.clinicId ?? '')
  }

  // Apply pagination
  const start = (page - 1) * limit
  const paginatedUsers = users.slice(start, start + limit)

  return new Response(JSON.stringify({
    users: paginatedUsers,
    total: users.length,
    page,
    limit
  }))
}

// POST /api/users
async function createUser(req: AuthenticatedRequest): Promise<Response> {
  const data = await parseRequestBody(req)

  // Validate and create user
  return withValidation(UserSchema, data, async (validatedData) => {
    // Only admins can create users for other clinics
    if (req.user.role !== 'admin' && validatedData.clinicId !== req.user.clinicId) {
      throw new Error('Cannot create user for different clinic')
    }

    // Use type assertion to ensure validatedData is of type Omit<User, 'id'>
    const user = await UserAccess.create(validatedData as Omit<User, 'id'>)
    return new Response(JSON.stringify(user), { status: 201 })
  })
}

// PUT /api/users
async function updateUsers(req: AuthenticatedRequest): Promise<Response> {
  const data = await parseRequestBody(req)

  return withValidation(UserUpdateSchema, data, async (validatedData) => {
    // Only admins can update users from other clinics
    if (req.user.role !== 'admin' && validatedData.clinicId !== req.user.clinicId) {
      throw new Error('Cannot update user from different clinic')
    }

    const user = await UserAccess.update(req.user.id, validatedData)
    return new Response(JSON.stringify(user))
  })
}

// DELETE /api/users
async function deleteUsers(req: AuthenticatedRequest): Promise<Response> {
  // Only admins can delete users
  await UserAccess.delete(req.user.id)
  return new Response(null, { status: 204 })
}

// Route handler
export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    return withAuth(req, async (authedReq) => {
      return getUsers(authedReq)
    })
  })
}

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    return withAuth(req, async (authedReq) => {
      return withRole(['amind', 'manager'])(authedReq, async (roleAuthedReq) => {
        return createUser(roleAuthedReq)
      })
    })
  })
}

export async function PUT(req: NextRequest) {
  return withErrorHandler(async () => {
    return withAuth(req, async (authedReq) => {
      return withRole(['amdin', 'manager'])(authedReq, async (roleAuthedReq) => {
        return updateUsers(roleAuthedReq)
      })
    })
  })
}

export async function DELETE(req: NextRequest) {
  return withErrorHandler(async () => {
    return withAuth(req, async (authedReq) => {
      return withRole(['admin'])(authedReq, async (roleAuthedReq) => {
        return deleteUsers(roleAuthedReq)
      })
    })
  })
}
