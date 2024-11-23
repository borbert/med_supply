/**
 * AWS Configuration Module
 * 
 * Centralizes AWS service configuration and initialization.
 * Handles:
 * - AWS Credentials management
 * - DynamoDB client configuration
 * - Table name constants
 * - Region settings
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

/**
 * AWS Region Configuration
 * Defaults to us-east-1 if not specified in environment variables
 */
const REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'

/**
 * DynamoDB Table Names
 * 
 * Consistent naming convention for all application tables:
 * - Prefix: 'clinicsupply-'
 * - Suffix: Entity name (users, orders, etc.)
 */
export const TableNames = {
	USERS: 'clinicsupply-users',
	TEMPLATES: 'clinicsupply-templates',
	ORDERS: 'clinicsupply-orders',
	CLINICS: 'clinicsupply-clinics',
	PRODUCTS: 'clinicsupply-products',
	SETTINGS: 'clinicsupply-settings'
} as const

/**
 * DynamoDB Client Configuration
 * 
 * Initializes the DynamoDB client with:
 * - Region from environment variables
 * - Access credentials from environment variables
 * - Default retry strategy
 */
const ddbClient = new DynamoDBClient({
	region: REGION,
	credentials: {
		accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ''
	}
})

/**
 * DynamoDB Document Client
 * 
 * Provides a higher-level interface for DynamoDB operations:
 * - Automatic marshalling of JSON objects
 * - Simplified API for common operations
 * - Better type safety
 */
export const dynamoDb = DynamoDBDocumentClient.from(ddbClient, {
	marshallOptions: {
		removeUndefinedValues: true
	}
})
