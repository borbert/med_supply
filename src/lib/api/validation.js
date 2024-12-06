/**
 * API Validation
 * 
 * Provides validation utilities for API requests using Zod
 */

import { z } from 'zod'
import { Errors } from './error'

// Common validation schemas
export const IdSchema = z.string().uuid()
export const EmailSchema = z.string().email()
export const DateSchema = z.string().datetime()

// User validation schemas
export const UserSchema = z.object({
  id: IdSchema.optional(),
  email: EmailSchema,
  name: z.string().min(1),
  clinicId: IdSchema,
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']),
  isActive: z.boolean().default(true),
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional()
})

export const UserUpdateSchema = UserSchema.partial().omit({ id: true })

// Clinic validation schemas
export const ClinicSchema = z.object({
  id: IdSchema.optional(),
  name: z.string().min(1),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string()
  }),
  phone: z.string(),
  email: EmailSchema,
  settings: z.object({
    orderApprovalRequired: z.boolean(),
    lowStockThreshold: z.number().min(0),
    autoReorder: z.boolean(),
    timezone: z.string(),
    currency: z.string(),
    dateFormat: z.string()
  }),
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional()
})

export const ClinicUpdateSchema = ClinicSchema.partial().omit({ id: true })

// Order validation schemas
export const OrderItemSchema = z.object({
  productId: IdSchema,
  quantity: z.number().min(1),
  price: z.number().min(0)
})

export const OrderSchema = z.object({
  id: IdSchema.optional(),
  clinicId: IdSchema,
  userId: IdSchema,
  items: z.array(OrderItemSchema),
  status: z.enum([
    'draft',
    'pending',
    'approved',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ]),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().min(0),
  notes: z.string().optional(),
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional()
})

export const OrderUpdateSchema = OrderSchema.partial().omit({ id: true })

// Product validation schemas
export const ProductSchema = z.object({
  id: IdSchema.optional(),
  name: z.string().min(1),
  description: z.string(),
  category: z.string(),
  manufacturer: z.string(),
  sku: z.string(),
  price: z.number().min(0),
  unit: z.string(),
  minStock: z.number().min(0),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional()
})

export const ProductUpdateSchema = ProductSchema.partial().omit({ id: true })

/**
 * Validation middleware
 * 
 * @param {import('zod').Schema} schema - Zod schema to validate against
 * @param {unknown} data - Data to validate
 * @returns {Object} Validated data
 * @throws {Error} If validation fails
 */
export function validateRequest(schema, data) {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Errors.ValidationError(error.errors)
    }
    throw error
  }
}

/**
 * Request handler with validation
 * 
 * @param {import('zod').Schema} schema - Zod schema to validate against
 * @param {unknown} data - Data to validate
 * @param {Function} handler - Handler function to call with validated data
 * @returns {Promise<any>} Handler result
 */
export async function withValidation(schema, data, handler) {
  const validatedData = validateRequest(schema, data)
  return handler(validatedData)
}
