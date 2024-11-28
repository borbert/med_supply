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
  email: z.string().email(),
  name: z.string().min(1),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'STAFF']),
  clinicId: z.string().uuid().optional(),
  status: z.enum(['active', 'disabled']),
  isActive: z.boolean(),
  settings: z.record(z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
})

export const UserUpdateSchema = UserSchema.partial()

// Clinic validation schemas
export const ClinicSchema = z.object({
  id: IdSchema.optional(),
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  isActive: z.boolean().default(true),
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional()
})

export const ClinicUpdateSchema = ClinicSchema.partial().omit({ id: true })

// Product validation schemas
export const ProductSchema = z.object({
  id: IdSchema.optional(),
  name: z.string().min(1),
  description: z.string(),
  category: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().min(0),
  unit: z.string().min(1),
  minQuantity: z.number().min(0),
  maxQuantity: z.number().min(0),
  isActive: z.boolean().default(true),
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional()
})

export const ProductUpdateSchema = ProductSchema.partial().omit({ id: true })

// Order validation schemas
export const OrderItemSchema = z.object({
  productId: IdSchema,
  quantity: z.number().min(1),
  price: z.number().min(0),
  notes: z.string().optional()
})

export const OrderSchema = z.object({
  id: IdSchema.optional(),
  clinicId: IdSchema,
  userId: IdSchema,
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  items: z.array(OrderItemSchema).min(1),
  totalAmount: z.number().min(0),
  notes: z.string().optional(),
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional()
})

export const OrderUpdateSchema = OrderSchema.partial().omit({ id: true })

// Template validation schemas
export const TemplateItemSchema = z.object({
  productId: IdSchema,
  defaultQuantity: z.number().min(1),
  notes: z.string().optional()
})

export const TemplateSchema = z.object({
  id: IdSchema.optional(),
  name: z.string().min(1),
  clinicId: IdSchema,
  items: z.array(TemplateItemSchema).min(1),
  isActive: z.boolean().default(true),
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional()
})

export const TemplateUpdateSchema = TemplateSchema.partial().omit({ id: true })

// Settings validation schemas
export const SettingsSchema = z.object({
  id: IdSchema.optional(),
  type: z.string().min(1),
  ownerId: IdSchema,
  data: z.record(z.unknown()),
  createdAt: DateSchema.optional(),
  updatedAt: DateSchema.optional()
})

export const SettingsUpdateSchema = SettingsSchema.partial().omit({ id: true })

// Validation middleware
export async function validateRequest<T>(
  schema: z.Schema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw Errors.badRequest(error.errors.map(e => e.message).join(', '))
    }
    throw error
  }
}

// Request handler with validation
export async function withValidation<T>(
  schema: z.Schema<T>,
  data: unknown,
  handler: (validatedData: T) => Promise<any>
): Promise<any> {
  const validatedData = await validateRequest(schema, data)
  return handler(validatedData)
}
