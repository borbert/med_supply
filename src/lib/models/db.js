/**
 * Mock Database Layer for MVP
 * 
 * This is a temporary in-memory implementation for MVP.
 * TODO: Implement proper database integration.
 */

import { v4 as uuidv4 } from 'uuid'

// Mock in-memory storage
const mockDb = {}

/**
 * Generic get item by ID
 * 
 * @param {string} tableName - Table name
 * @param {string} id - Item ID
 * @returns {Promise<Object|null>} The item if found, null otherwise
 */
export async function getById(tableName, id) {
  return mockDb[tableName]?.[id] || null
}

/**
 * Generic create item
 * 
 * @param {string} tableName - Table name
 * @param {Object} item - Item to create
 * @returns {Promise<Object>} Created item
 */
export async function create(tableName, item) {
  if (!mockDb[tableName]) {
    mockDb[tableName] = {}
  }

  const id = item.id || uuidv4()
  const timestamp = new Date().toISOString()
  const newItem = {
    ...item,
    id,
    createdAt: timestamp,
    updatedAt: timestamp
  }

  mockDb[tableName][id] = newItem
  return newItem
}

/**
 * Generic update item
 * 
 * @param {string} tableName - Table name
 * @param {string} id - Item ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated item
 * @throws {Error} If item not found
 */
export async function update(tableName, id, updates) {
  const item = await getById(tableName, id)
  if (!item) {
    throw new Error(`Item not found: ${id}`)
  }

  const updatedItem = {
    ...item,
    ...updates,
    id,
    updatedAt: new Date().toISOString()
  }

  mockDb[tableName][id] = updatedItem
  return updatedItem
}

/**
 * Generic delete item
 * 
 * @param {string} tableName - Table name
 * @param {string} id - Item ID
 * @returns {Promise<void>}
 */
export async function remove(tableName, id) {
  if (mockDb[tableName]?.[id]) {
    delete mockDb[tableName][id]
  }
}

/**
 * Query items by index
 * 
 * @param {string} tableName - Table name
 * @param {string} indexName - Index name
 * @param {string} hashKey - Partition key name
 * @param {string} hashValue - Partition key value
 * @param {string} [rangeKey] - Optional sort key name
 * @param {string} [rangeValue] - Optional sort key value
 * @returns {Promise<Array>} Matching items
 */
export async function queryByIndex(tableName, indexName, hashKey, hashValue, rangeKey, rangeValue) {
  if (!mockDb[tableName]) return []

  return Object.values(mockDb[tableName]).filter(item => {
    const hashMatch = item[hashKey] === hashValue
    if (!rangeKey || !rangeValue) return hashMatch
    return hashMatch && item[rangeKey] === rangeValue
  })
}

/**
 * Scan all items in a table
 * 
 * @param {string} tableName - Table name
 * @param {number} [limit] - Optional maximum number of items to return
 * @returns {Promise<Array>} All items in the table
 */
export async function scanAll(tableName, limit) {
  if (!mockDb[tableName]) {
    return []
  }
  
  const items = Object.values(mockDb[tableName])
  return limit ? items.slice(0, limit) : items
}
