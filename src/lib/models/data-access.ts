/**
 * Data Access Functions
 * 
 * Provides specific data access functions for each table in the application.
 * These functions wrap the generic DynamoDB utility functions with type safety
 * and business logic specific to each entity.
 */

import { TableNames } from '../aws-config'
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

// User Functions
export const UserAccess = {
	async getById(id: string): Promise<User | null> {
		return db.getById<User>(TableNames.USERS, id)
	},

	async getByEmail(email: string): Promise<User | null> {
		const users = await db.queryByIndex<User>(
			TableNames.USERS,
			'EmailIndex',
			'email',
			email
		)
		return users[0] || null
	},

	async getByClinic(clinicId: string): Promise<User[]> {
		return db.queryByIndex<User>(
			TableNames.USERS,
			'ClinicIndex',
			'clinicId',
			clinicId
		)
	},

	async create(user: Omit<User, 'id'>): Promise<User> {
		return db.create<User>(TableNames.USERS, user as User)
	},

	async update(id: string, updates: Partial<User>): Promise<User> {
		return db.update<User>(TableNames.USERS, id, updates)
	},

	async delete(id: string): Promise<void> {
		return db.remove(TableNames.USERS, id)
	}
}

// Clinic Functions
export const ClinicAccess = {
	async getById(id: string): Promise<Clinic | null> {
		return db.getById<Clinic>(TableNames.CLINICS, id)
	},

	async getAll(): Promise<Clinic[]> {
		return db.scanAll<Clinic>(TableNames.CLINICS)
	},

	async create(clinic: Omit<Clinic, 'id'>): Promise<Clinic> {
		return db.create<Clinic>(TableNames.CLINICS, clinic as Clinic)
	},

	async update(id: string, updates: Partial<Clinic>): Promise<Clinic> {
		return db.update<Clinic>(TableNames.CLINICS, id, updates)
	},

	async delete(id: string): Promise<void> {
		return db.remove(TableNames.CLINICS, id)
	}
}

// Product Functions
export const ProductAccess = {
	async getById(id: string): Promise<Product | null> {
		return db.getById<Product>(TableNames.PRODUCTS, id)
	},

	async getByCategory(category: string): Promise<Product[]> {
		return db.queryByIndex<Product>(
			TableNames.PRODUCTS,
			'CategoryIndex',
			'category',
			category
		)
	},

	async getAll(): Promise<Product[]> {
		return db.scanAll<Product>(TableNames.PRODUCTS)
	},

	async create(product: Omit<Product, 'id'>): Promise<Product> {
		return db.create<Product>(TableNames.PRODUCTS, product as Product)
	},

	async update(id: string, updates: Partial<Product>): Promise<Product> {
		return db.update<Product>(TableNames.PRODUCTS, id, updates)
	},

	async delete(id: string): Promise<void> {
		return db.remove(TableNames.PRODUCTS, id)
	}
}

// Order Functions
export const OrderAccess = {
	async getById(id: string): Promise<Order | null> {
		return db.getById<Order>(TableNames.ORDERS, id)
	},

	async getByClinic(clinicId: string): Promise<Order[]> {
		return db.queryByIndex<Order>(
			TableNames.ORDERS,
			'ClinicOrdersIndex',
			'clinicId',
			clinicId
		)
	},

	async getByUser(userId: string): Promise<Order[]> {
		return db.queryByIndex<Order>(
			TableNames.ORDERS,
			'UserOrdersIndex',
			'userId',
			userId
		)
	},

	async getByStatus(status: OrderStatus): Promise<Order[]> {
		return db.queryByIndex<Order>(
			TableNames.ORDERS,
			'StatusIndex',
			'status',
			status
		)
	},

	async create(order: Omit<Order, 'id'>): Promise<Order> {
		return db.create<Order>(TableNames.ORDERS, order as Order)
	},

	async update(id: string, updates: Partial<Order>): Promise<Order> {
		return db.update<Order>(TableNames.ORDERS, id, updates)
	},

	async delete(id: string): Promise<void> {
		return db.remove(TableNames.ORDERS, id)
	}
}

// Template Functions
export const TemplateAccess = {
	async getById(id: string): Promise<Template | null> {
		return db.getById<Template>(TableNames.TEMPLATES, id)
	},

	async getByClinic(clinicId: string): Promise<Template[]> {
		return db.queryByIndex<Template>(
			TableNames.TEMPLATES,
			'ClinicTemplatesIndex',
			'clinicId',
			clinicId
		)
	},

	async create(template: Omit<Template, 'id'>): Promise<Template> {
		return db.create<Template>(TableNames.TEMPLATES, template as Template)
	},

	async update(id: string, updates: Partial<Template>): Promise<Template> {
		return db.update<Template>(TableNames.TEMPLATES, id, updates)
	},

	async delete(id: string): Promise<void> {
		return db.remove(TableNames.TEMPLATES, id)
	}
}

// Settings Functions
export const SettingsAccess = {
	async getById(id: string): Promise<Settings | null> {
		return db.getById<Settings>(TableNames.SETTINGS, id)
	},

	async getByType(type: string): Promise<Settings[]> {
		return db.queryByIndex<Settings>(
			TableNames.SETTINGS,
			'TypeIndex',
			'type',
			type
		)
	},

	async getByOwner(ownerId: string): Promise<Settings[]> {
		return db.queryByIndex<Settings>(
			TableNames.SETTINGS,
			'OwnerIndex',
			'ownerId',
			ownerId
		)
	},

	async create(settings: Omit<Settings, 'id'>): Promise<Settings> {
		return db.create<Settings>(TableNames.SETTINGS, settings as Settings)
	},

	async update(id: string, updates: Partial<Settings>): Promise<Settings> {
		return db.update<Settings>(TableNames.SETTINGS, id, updates)
	},

	async delete(id: string): Promise<void> {
		return db.remove(TableNames.SETTINGS, id)
	}
}
