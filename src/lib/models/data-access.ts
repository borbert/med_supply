/**
 * Data Access Functions
 * 
 * Provides specific data access functions for each table in the application.
 * These functions wrap the generic database functions with type safety
 * and business logic specific to each entity.
 */

import { MOCK_CONFIG } from '../aws-config'
import * as db from './db'
import {
  User,
  Clinic,
  Product,
  Order,
  Template,
  Settings,
  OrderStatus
} from './types'

// Generic type for all entities with ID
type WithOptionalId = { id?: string }
type WithRequiredId = { id: string }

// User Functions
export const UserAccess = {
  async getById(id: string): Promise<User | null> {
    return db.getById(MOCK_CONFIG.tables.users, id)
  },

  async getByEmail(email: string): Promise<User | null> {
    const users = await db.queryByIndex<User>(
      MOCK_CONFIG.tables.users,
      'email-index',
      'email',
      email
    )
    return users[0]
  },

  async getByClinic(clinicId: string): Promise<User[]> {
    return db.queryByIndex(
      MOCK_CONFIG.tables.users,
      'clinic-index',
      'clinicId',
      clinicId
    )
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    const input = user as WithOptionalId
    return db.create(MOCK_CONFIG.tables.users, input) as Promise<User>
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    return db.update(MOCK_CONFIG.tables.users, id, updates)
  },

  async delete(id: string): Promise<void> {
    return db.remove(MOCK_CONFIG.tables.users, id)
  },

  async getAll(): Promise<User[]> {
    return db.scanAll(MOCK_CONFIG.tables.users)
  }
}

// Clinic Functions
export const ClinicAccess = {
  async getById(id: string): Promise<Clinic | null> {
    return db.getById(MOCK_CONFIG.tables.clinics, id)
  },

  async getAll(): Promise<Clinic[]> {
    return db.scanAll(MOCK_CONFIG.tables.clinics)
  },

  async create(clinic: Omit<Clinic, 'id'>): Promise<Clinic> {
    const input = clinic as WithOptionalId
    return db.create(MOCK_CONFIG.tables.users, input) as Promise<Clinic>
  },

  async update(id: string, updates: Partial<Clinic>): Promise<Clinic> {
    return db.update(MOCK_CONFIG.tables.clinics, id, updates)
  },

  async delete(id: string): Promise<void> {
    return db.remove(MOCK_CONFIG.tables.clinics, id)
  }
}

// Product Functions
export const ProductAccess = {
  async getById(id: string): Promise<Product | null> {
    return db.getById(MOCK_CONFIG.tables.products, id)
  },

  async getByCategory(category: string): Promise<Product[]> {
    return db.queryByIndex(
      MOCK_CONFIG.tables.products,
      'category-index',
      'category',
      category
    )
  },

  async getAll(): Promise<Product[]> {
    return db.scanAll(MOCK_CONFIG.tables.products)
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const input = product as WithOptionalId
    return db.create(MOCK_CONFIG.tables.products, input) as Promise<Product>
  },

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    return db.update(MOCK_CONFIG.tables.products, id, updates)
  },

  async delete(id: string): Promise<void> {
    return db.remove(MOCK_CONFIG.tables.products, id)
  }
}

// Order Functions
export const OrderAccess = {
  async getById(id: string): Promise<Order | null> {
    return db.getById(MOCK_CONFIG.tables.orders, id)
  },

  async getByClinic(clinicId: string): Promise<Order[]> {
    return db.queryByIndex(
      MOCK_CONFIG.tables.orders,
      'clinic-index',
      'clinicId',
      clinicId
    )
  },

  async getByUser(userId: string): Promise<Order[]> {
    return db.queryByIndex(
      MOCK_CONFIG.tables.orders,
      'user-index',
      'userId',
      userId
    )
  },

  async getByStatus(status: OrderStatus): Promise<Order[]> {
    return db.queryByIndex(
      MOCK_CONFIG.tables.orders,
      'status-index',
      'status',
      status
    )
  },

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    const input = order as WithOptionalId
    return db.create(MOCK_CONFIG.tables.orders, input) as Promise<Order>
  },

  async update(id: string, updates: Partial<Order>): Promise<Order> {
    return db.update(MOCK_CONFIG.tables.orders, id, updates)
  },

  async delete(id: string): Promise<void> {
    return db.remove(MOCK_CONFIG.tables.orders, id)
  }
}

// Template Functions
export const TemplateAccess = {
  async getById(id: string): Promise<Template | null> {
    return db.getById(MOCK_CONFIG.tables.templates, id)
  },

  async getByClinic(clinicId: string): Promise<Template[]> {
    return db.queryByIndex(
      MOCK_CONFIG.tables.templates,
      'clinic-index',
      'clinicId',
      clinicId
    )
  },

  async create(template: Omit<Template, 'id'>): Promise<Template> {
    const input = template as WithOptionalId
    return db.create(MOCK_CONFIG.tables.templates, input) as Promise<Template>
  },

  async update(id: string, updates: Partial<Template>): Promise<Template> {
    return db.update(MOCK_CONFIG.tables.templates, id, updates)
  },

  async delete(id: string): Promise<void> {
    return db.remove(MOCK_CONFIG.tables.templates, id)
  }
}

// Settings Functions
export const SettingsAccess = {
  async getById(id: string): Promise<Settings | null> {
    return db.getById(MOCK_CONFIG.tables.settings, id)
  },

  async getByType(type: string): Promise<Settings[]> {
    return db.queryByIndex(
      MOCK_CONFIG.tables.settings,
      'type-index',
      'type',
      type
    )
  },

  async getByOwner(ownerId: string): Promise<Settings[]> {
    return db.queryByIndex(
      MOCK_CONFIG.tables.settings,
      'owner-index',
      'ownerId',
      ownerId
    )
  },

  async create(settings: Omit<Settings, 'id'>): Promise<Settings> {
    const input = settings as WithOptionalId
    return db.create(MOCK_CONFIG.tables.settings, input) as Promise<Settings>
  },

  async update(id: string, updates: Partial<Settings>): Promise<Settings> {
    return db.update(MOCK_CONFIG.tables.settings, id, updates)
  },

  async delete(id: string): Promise<void> {
    return db.remove(MOCK_CONFIG.tables.settings, id)
  }
}
