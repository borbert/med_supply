import { join } from "path"

/**
 * Core Type Definitions
 * 
 * This file contains TypeScript interfaces for all core data models
 * used throughout the application.
 */

export interface User {
	id: string
	email: string
	name: string
	firstName?: string
	lastName?: string
	role: 'ADMIN' | 'MANAGER' | 'STAFF'
	clinicId?: string
	status: 'active' | 'disabled'
	isActive: boolean
	settings?: Record<string, any>
	createdAt?: string
	updatedAt?: string
}

export interface UserSettings {
	emailNotifications: boolean
	stockAlerts: boolean
	orderUpdates: boolean
	timezone: string
	currency: string
	dateFormat: string
}

export interface Clinic {
	id: string
	name: string
	address: Address
	phone: string
	email: string
	settings: ClinicSettings
	createdAt: string
	updatedAt: string
}

export interface Address {
	street: string
	city: string
	state: string
	zipCode: string
	country: string
}

export interface ClinicSettings {
	orderApprovalRequired: boolean
	lowStockThreshold: number
	autoReorder: boolean
	defaultCurrency: string
}

export interface Product {
	id: string
	name: string
	description: string
	category: string
	price: number
	unit: string
	minStock: number
	imageUrl: string
	manufacturer: string
	sku: string
	isActive: boolean
	createdAt: string
	updatedAt: string
}

export interface ProductStock {
	productId: string
	clinicId: string
	quantity: number
	lastUpdated: string
}

export interface Order {
	id: string
	clinicId: string
	userId: string
	status: OrderStatus
	items: OrderItem[]
	subtotal: number
	tax: number
	total: number
	notes: string
	createdAt: string
	updatedAt: string
}

export interface OrderItem {
	productId: string
	quantity: number
	price: number
	total: number
}

export type OrderStatus = 
	| 'draft'
	| 'pending'
	| 'approved'
	| 'processing'
	| 'shipped'
	| 'delivered'
	| 'cancelled'

export interface Template {
	id: string
	clinicId: string
	name: string
	description: string
	items: TemplateItem[]
	createdBy: string
	createdAt: string
	updatedAt: string
}

export interface TemplateItem {
	productId: string
	quantity: number
}

export interface Settings {
	id: string
	type: 'global' | 'clinic'
	ownerId?: string // clinicId for clinic-specific settings
	config: Record<string, any>
	createdAt: string
	updatedAt: string
}
