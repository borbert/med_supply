/**
 * Mock Database Layer for MVP
 * 
 * This is a temporary in-memory implementation for MVP.
 * TODO: Implement proper database integration.
 */

import { v4 as uuidv4 } from 'uuid'

// Mock in-memory storage
const mockDb: { [tableName: string]: { [id: string]: any } } = {}

/**
 * Generic get item by ID
 * 
 * @param tableName - Table name
 * @param id - Item ID
 * @returns The item if found, null otherwise
 */
export async function getById<T>(tableName: string, id: string): Promise<T | null> {
  return mockDb[tableName]?.[id] || null
}

/**
 * Generic create item
 * 
 * @param tableName - Table name
 * @param item - Item to create
 * @returns Created item with generated ID
 */
export async function create<T extends { id?: string }>(
  tableName: string,
  item: T
): Promise<T> {
  if (!mockDb[tableName]) {
    mockDb[tableName] = {}
  }
  
  const id = item.id || uuidv4()
  const newItem = { ...item, id }
  mockDb[tableName][id] = newItem
  return newItem
}

/**
 * Generic update item
 * 
 * @param tableName - Table name
 * @param id - Item ID
 * @param updates - Partial item with updates
 * @returns Updated item
 */
export async function update<T>(
  tableName: string,
  id: string,
  updates: Partial<T>
): Promise<T> {
  if (!mockDb[tableName]?.[id]) {
    throw new Error('Item not found')
  }

  const updatedItem = {
    ...mockDb[tableName][id],
    ...updates,
    id
  }
  mockDb[tableName][id] = updatedItem
  return updatedItem
}

/**
 * Generic delete item
 * 
 * @param tableName - Table name
 * @param id - Item ID
 */
export async function remove(tableName: string, id: string): Promise<void> {
  if (mockDb[tableName]?.[id]) {
    delete mockDb[tableName][id]
  }
}

/**
 * Query items by index
 * 
 * @param tableName - Table name
 * @param indexName - Index name
 * @param hashKey - Partition key name
 * @param hashValue - Partition key value
 * @param rangeKey - Optional sort key name
 * @param rangeValue - Optional sort key value
 * @returns Array of matching items
 */
export async function queryByIndex<T>(
  tableName: string,
  indexName: string,
  hashKey: string,
  hashValue: string,
  rangeKey?: string,
  rangeValue?: string
): Promise<T[]> {
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
 * @param tableName - Table name
 * @param limit - Optional maximum number of items to return
 * @returns Array of items
 */
export async function scanAll<T>(
  tableName: string,
  limit?: number
): Promise<T[]> {
  if (!mockDb[tableName]) return []
  
  const items = Object.values(mockDb[tableName])
  return limit ? items.slice(0, limit) : items
}
