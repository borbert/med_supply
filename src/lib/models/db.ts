/**
 * DynamoDB Utility Functions
 * 
 * Provides a set of helper functions for common DynamoDB operations
 * including CRUD operations and querying with indexes.
 */

import {
	GetCommand,
	PutCommand,
	DeleteCommand,
	QueryCommand,
	UpdateCommand,
	ScanCommand
} from '@aws-sdk/lib-dynamodb'
import { dynamoDb } from '../aws-config'
import { v4 as uuidv4 } from 'uuid'

/**
 * Generic get item by ID
 * 
 * @param tableName - DynamoDB table name
 * @param id - Item ID
 * @returns The item if found, null otherwise
 */
export async function getById<T>(tableName: string, id: string): Promise<T | null> {
	try {
		const command = new GetCommand({
			TableName: tableName,
			Key: { id }
		})

		const response = await dynamoDb.send(command)
		return (response.Item as T) || null
	} catch (error) {
		console.error('Error getting item by ID:', error)
		throw error
	}
}

/**
 * Generic create item
 * 
 * @param tableName - DynamoDB table name
 * @param item - Item to create
 * @returns Created item with generated ID
 */
export async function create<T extends { id?: string }>(
	tableName: string,
	item: T
): Promise<T> {
	try {
		const timestamp = new Date().toISOString()
		const newItem = {
			...item,
			id: item.id || uuidv4(),
			createdAt: timestamp,
			updatedAt: timestamp
		}

		const command = new PutCommand({
			TableName: tableName,
			Item: newItem
		})

		await dynamoDb.send(command)
		return newItem as T
	} catch (error) {
		console.error('Error creating item:', error)
		throw error
	}
}

/**
 * Generic update item
 * 
 * @param tableName - DynamoDB table name
 * @param id - Item ID
 * @param updates - Partial item with updates
 * @returns Updated item
 */
export async function update<T>(
	tableName: string,
	id: string,
	updates: Partial<T>
): Promise<T> {
	try {
		const timestamp = new Date().toISOString()

		// Build update expression and attribute values
		const updateExpressions: string[] = []
		const expressionAttributeNames: Record<string, string> = {}
		const expressionAttributeValues: Record<string, any> = {}

		Object.entries(updates).forEach(([key, value]) => {
			if (key !== 'id') { // Prevent updating the ID
				const attributeName = `#${key}`
				const attributeValue = `:${key}`
				updateExpressions.push(`${attributeName} = ${attributeValue}`)
				expressionAttributeNames[attributeName] = key
				expressionAttributeValues[attributeValue] = value
			}
		})

		// Add updatedAt timestamp
		updateExpressions.push('#updatedAt = :updatedAt')
		expressionAttributeNames['#updatedAt'] = 'updatedAt'
		expressionAttributeValues[':updatedAt'] = timestamp

		const command = new UpdateCommand({
			TableName: tableName,
			Key: { id },
			UpdateExpression: `SET ${updateExpressions.join(', ')}`,
			ExpressionAttributeNames: expressionAttributeNames,
			ExpressionAttributeValues: expressionAttributeValues,
			ReturnValues: 'ALL_NEW'
		})

		const response = await dynamoDb.send(command)
		return response.Attributes as T
	} catch (error) {
		console.error('Error updating item:', error)
		throw error
	}
}

/**
 * Generic delete item
 * 
 * @param tableName - DynamoDB table name
 * @param id - Item ID
 */
export async function remove(tableName: string, id: string): Promise<void> {
	try {
		const command = new DeleteCommand({
			TableName: tableName,
			Key: { id }
		})

		await dynamoDb.send(command)
	} catch (error) {
		console.error('Error deleting item:', error)
		throw error
	}
}

/**
 * Query items by index
 * 
 * @param tableName - DynamoDB table name
 * @param indexName - GSI or LSI name
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
	try {
		const keyConditions: string[] = [`#${hashKey} = :${hashKey}`]
		const expressionAttributeNames: Record<string, string> = {
			[`#${hashKey}`]: hashKey
		}
		const expressionAttributeValues: Record<string, any> = {
			[`:${hashKey}`]: hashValue
		}

		if (rangeKey && rangeValue !== undefined) {
			keyConditions.push(`#${rangeKey} = :${rangeKey}`)
			expressionAttributeNames[`#${rangeKey}`] = rangeKey
			expressionAttributeValues[`:${rangeKey}`] = rangeValue
		}

		const command = new QueryCommand({
			TableName: tableName,
			IndexName: indexName,
			KeyConditionExpression: keyConditions.join(' AND '),
			ExpressionAttributeNames: expressionAttributeNames,
			ExpressionAttributeValues: expressionAttributeValues
		})

		const response = await dynamoDb.send(command)
		return (response.Items || []) as T[]
	} catch (error) {
		console.error('Error querying by index:', error)
		throw error
	}
}

/**
 * Scan all items in a table
 * 
 * @param tableName - DynamoDB table name
 * @param limit - Optional maximum number of items to return
 * @returns Array of items
 */
export async function scanAll<T>(
	tableName: string,
	limit?: number
): Promise<T[]> {
	try {
		const command = new ScanCommand({
			TableName: tableName,
			Limit: limit
		})

		const response = await dynamoDb.send(command)
		return (response.Items || []) as T[]
	} catch (error) {
		console.error('Error scanning table:', error)
		throw error
	}
}
