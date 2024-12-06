/**
 * Data Access Functions
 * 
 * Provides specific data access functions for each table in the application.
 * These functions wrap the generic database functions with type safety
 * and business logic specific to each entity.
 */

import { MOCK_CONFIG } from '../aws-config'
import * as db from './db'

// User Functions
export const UserAccess = {
  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   */
  async getById(id) {
    return db.getById(MOCK_CONFIG.tables.users, id)
  },

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  async getByEmail(email) {
    const results = await db.query(MOCK_CONFIG.tables.users, {
      indexName: 'EmailIndex',
      keyConditionExpression: 'email = :email',
      expressionAttributeValues: { ':email': email }
    })
    return results[0]
  },

  /**
   * Get users by clinic
   * @param {string} clinicId - Clinic ID
   * @returns {Promise<Array>} List of users
   */
  async getByClinic(clinicId) {
    return db.query(MOCK_CONFIG.tables.users, {
      indexName: 'ClinicIndex',
      keyConditionExpression: 'clinicId = :clinicId',
      expressionAttributeValues: { ':clinicId': clinicId }
    })
  },

  /**
   * Create new user
   * @param {Object} user - User object
   * @returns {Promise<Object>} Created user
   */
  async create(user) {
    return db.create(MOCK_CONFIG.tables.users, user)
  },

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updates - Update object
   * @returns {Promise<Object>} Updated user
   */
  async update(id, updates) {
    return db.update(MOCK_CONFIG.tables.users, id, updates)
  },

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return db.delete(MOCK_CONFIG.tables.users, id)
  }
}

// Clinic Functions
export const ClinicAccess = {
  /**
   * Get clinic by ID
   * @param {string} id - Clinic ID
   * @returns {Promise<Object>} Clinic object
   */
  async getById(id) {
    return db.getById(MOCK_CONFIG.tables.clinics, id)
  },

  /**
   * Get all clinics
   * @returns {Promise<Array>} List of clinics
   */
  async getAll() {
    return db.scanAll(MOCK_CONFIG.tables.clinics)
  },

  /**
   * Create new clinic
   * @param {Object} clinic - Clinic object
   * @returns {Promise<Object>} Created clinic
   */
  async create(clinic) {
    return db.create(MOCK_CONFIG.tables.clinics, clinic)
  },

  /**
   * Update clinic
   * @param {string} id - Clinic ID
   * @param {Object} updates - Update object
   * @returns {Promise<Object>} Updated clinic
   */
  async update(id, updates) {
    return db.update(MOCK_CONFIG.tables.clinics, id, updates)
  },

  /**
   * Delete clinic
   * @param {string} id - Clinic ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return db.delete(MOCK_CONFIG.tables.clinics, id)
  }
}

// Product Functions
export const ProductAccess = {
  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getById(id) {
    return db.getById(MOCK_CONFIG.tables.products, id)
  },

  /**
   * Get products by category
   * @param {string} category - Product category
   * @returns {Promise<Array>} List of products
   */
  async getByCategory(category) {
    return db.query(MOCK_CONFIG.tables.products, {
      indexName: 'CategoryIndex',
      keyConditionExpression: 'category = :category',
      expressionAttributeValues: { ':category': category }
    })
  },

  /**
   * Get all products
   * @returns {Promise<Array>} List of products
   */
  async getAll() {
    return db.scanAll(MOCK_CONFIG.tables.products)
  },

  /**
   * Create new product
   * @param {Object} product - Product object
   * @returns {Promise<Object>} Created product
   */
  async create(product) {
    return db.create(MOCK_CONFIG.tables.products, product)
  },

  /**
   * Update product
   * @param {string} id - Product ID
   * @param {Object} updates - Update object
   * @returns {Promise<Object>} Updated product
   */
  async update(id, updates) {
    return db.update(MOCK_CONFIG.tables.products, id, updates)
  },

  /**
   * Delete product
   * @param {string} id - Product ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return db.delete(MOCK_CONFIG.tables.products, id)
  }
}

// Order Functions
export const OrderAccess = {
  /**
   * Get order by ID
   * @param {string} id - Order ID
   * @returns {Promise<Object>} Order object
   */
  async getById(id) {
    return db.getById(MOCK_CONFIG.tables.orders, id)
  },

  /**
   * Get orders by clinic
   * @param {string} clinicId - Clinic ID
   * @returns {Promise<Array>} List of orders
   */
  async getByClinic(clinicId) {
    return db.query(MOCK_CONFIG.tables.orders, {
      indexName: 'ClinicIndex',
      keyConditionExpression: 'clinicId = :clinicId',
      expressionAttributeValues: { ':clinicId': clinicId }
    })
  },

  /**
   * Get orders by user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of orders
   */
  async getByUser(userId) {
    return db.query(MOCK_CONFIG.tables.orders, {
      indexName: 'UserIndex',
      keyConditionExpression: 'userId = :userId',
      expressionAttributeValues: { ':userId': userId }
    })
  },

  /**
   * Get orders by status
   * @param {string} status - Order status
   * @returns {Promise<Array>} List of orders
   */
  async getByStatus(status) {
    return db.query(MOCK_CONFIG.tables.orders, {
      indexName: 'StatusIndex',
      keyConditionExpression: 'status = :status',
      expressionAttributeValues: { ':status': status }
    })
  },

  /**
   * Create new order
   * @param {Object} order - Order object
   * @returns {Promise<Object>} Created order
   */
  async create(order) {
    return db.create(MOCK_CONFIG.tables.orders, order)
  },

  /**
   * Update order
   * @param {string} id - Order ID
   * @param {Object} updates - Update object
   * @returns {Promise<Object>} Updated order
   */
  async update(id, updates) {
    return db.update(MOCK_CONFIG.tables.orders, id, updates)
  },

  /**
   * Delete order
   * @param {string} id - Order ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return db.delete(MOCK_CONFIG.tables.orders, id)
  }
}

// Template Functions
export const TemplateAccess = {
  /**
   * Get template by ID
   * @param {string} id - Template ID
   * @returns {Promise<Object>} Template object
   */
  async getById(id) {
    return db.getById(MOCK_CONFIG.tables.templates, id)
  },

  /**
   * Get templates by clinic
   * @param {string} clinicId - Clinic ID
   * @returns {Promise<Array>} List of templates
   */
  async getByClinic(clinicId) {
    return db.query(MOCK_CONFIG.tables.templates, {
      indexName: 'ClinicIndex',
      keyConditionExpression: 'clinicId = :clinicId',
      expressionAttributeValues: { ':clinicId': clinicId }
    })
  },

  /**
   * Create new template
   * @param {Object} template - Template object
   * @returns {Promise<Object>} Created template
   */
  async create(template) {
    return db.create(MOCK_CONFIG.tables.templates, template)
  },

  /**
   * Update template
   * @param {string} id - Template ID
   * @param {Object} updates - Update object
   * @returns {Promise<Object>} Updated template
   */
  async update(id, updates) {
    return db.update(MOCK_CONFIG.tables.templates, id, updates)
  },

  /**
   * Delete template
   * @param {string} id - Template ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return db.delete(MOCK_CONFIG.tables.templates, id)
  }
}

// Settings Functions
export const SettingsAccess = {
  /**
   * Get settings by ID
   * @param {string} id - Settings ID
   * @returns {Promise<Object>} Settings object
   */
  async getById(id) {
    return db.getById(MOCK_CONFIG.tables.settings, id)
  },

  /**
   * Get settings by type
   * @param {string} type - Settings type
   * @returns {Promise<Array>} List of settings
   */
  async getByType(type) {
    return db.query(MOCK_CONFIG.tables.settings, {
      indexName: 'TypeIndex',
      keyConditionExpression: 'type = :type',
      expressionAttributeValues: { ':type': type }
    })
  },

  /**
   * Get settings by owner
   * @param {string} ownerId - Owner ID
   * @returns {Promise<Array>} List of settings
   */
  async getByOwner(ownerId) {
    return db.query(MOCK_CONFIG.tables.settings, {
      indexName: 'OwnerIndex',
      keyConditionExpression: 'ownerId = :ownerId',
      expressionAttributeValues: { ':ownerId': ownerId }
    })
  },

  /**
   * Create new settings
   * @param {Object} settings - Settings object
   * @returns {Promise<Object>} Created settings
   */
  async create(settings) {
    return db.create(MOCK_CONFIG.tables.settings, settings)
  },

  /**
   * Update settings
   * @param {string} id - Settings ID
   * @param {Object} updates - Update object
   * @returns {Promise<Object>} Updated settings
   */
  async update(id, updates) {
    return db.update(MOCK_CONFIG.tables.settings, id, updates)
  },

  /**
   * Delete settings
   * @param {string} id - Settings ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    return db.delete(MOCK_CONFIG.tables.settings, id)
  }
}
