/**
 * DynamoDB Schema Definitions
 * 
 * This file contains the schema definitions for DynamoDB tables
 * and utility functions for data access patterns.
 */

import { TableNames } from '../aws-config'

/**
 * DynamoDB Table Schemas
 * 
 * Defines the structure and access patterns for each table:
 * - Primary keys (Partition Key and Sort Key)
 * - Global Secondary Indexes (GSIs)
 * - Local Secondary Indexes (LSIs)
 */
export const TableSchemas = {
	// Users Table
	[TableNames.USERS]: {
		TableName: TableNames.USERS,
		KeySchema: [
			{ AttributeName: 'id', KeyType: 'HASH' }
		],
		AttributeDefinitions: [
			{ AttributeName: 'id', AttributeType: 'S' },
			{ AttributeName: 'email', AttributeType: 'S' },
			{ AttributeName: 'clinicId', AttributeType: 'S' }
		],
		GlobalSecondaryIndexes: [
			{
				IndexName: 'EmailIndex',
				KeySchema: [
					{ AttributeName: 'email', KeyType: 'HASH' }
				],
				Projection: { ProjectionType: 'ALL' }
			},
			{
				IndexName: 'ClinicIndex',
				KeySchema: [
					{ AttributeName: 'clinicId', KeyType: 'HASH' }
				],
				Projection: { ProjectionType: 'ALL' }
			}
		]
	},

	// Clinics Table
	[TableNames.CLINICS]: {
		TableName: TableNames.CLINICS,
		KeySchema: [
			{ AttributeName: 'id', KeyType: 'HASH' }
		],
		AttributeDefinitions: [
			{ AttributeName: 'id', AttributeType: 'S' }
		]
	},

	// Products Table
	[TableNames.PRODUCTS]: {
		TableName: TableNames.PRODUCTS,
		KeySchema: [
			{ AttributeName: 'id', KeyType: 'HASH' }
		],
		AttributeDefinitions: [
			{ AttributeName: 'id', AttributeType: 'S' },
			{ AttributeName: 'category', AttributeType: 'S' }
		],
		GlobalSecondaryIndexes: [
			{
				IndexName: 'CategoryIndex',
				KeySchema: [
					{ AttributeName: 'category', KeyType: 'HASH' }
				],
				Projection: { ProjectionType: 'ALL' }
			}
		]
	},

	// Orders Table
	[TableNames.ORDERS]: {
		TableName: TableNames.ORDERS,
		KeySchema: [
			{ AttributeName: 'id', KeyType: 'HASH' }
		],
		AttributeDefinitions: [
			{ AttributeName: 'id', AttributeType: 'S' },
			{ AttributeName: 'clinicId', AttributeType: 'S' },
			{ AttributeName: 'userId', AttributeType: 'S' },
			{ AttributeName: 'status', AttributeType: 'S' },
			{ AttributeName: 'createdAt', AttributeType: 'S' }
		],
		GlobalSecondaryIndexes: [
			{
				IndexName: 'ClinicOrdersIndex',
				KeySchema: [
					{ AttributeName: 'clinicId', KeyType: 'HASH' },
					{ AttributeName: 'createdAt', KeyType: 'RANGE' }
				],
				Projection: { ProjectionType: 'ALL' }
			},
			{
				IndexName: 'UserOrdersIndex',
				KeySchema: [
					{ AttributeName: 'userId', KeyType: 'HASH' },
					{ AttributeName: 'createdAt', KeyType: 'RANGE' }
				],
				Projection: { ProjectionType: 'ALL' }
			},
			{
				IndexName: 'StatusIndex',
				KeySchema: [
					{ AttributeName: 'status', KeyType: 'HASH' },
					{ AttributeName: 'createdAt', KeyType: 'RANGE' }
				],
				Projection: { ProjectionType: 'ALL' }
			}
		]
	},

	// Templates Table
	[TableNames.TEMPLATES]: {
		TableName: TableNames.TEMPLATES,
		KeySchema: [
			{ AttributeName: 'id', KeyType: 'HASH' }
		],
		AttributeDefinitions: [
			{ AttributeName: 'id', AttributeType: 'S' },
			{ AttributeName: 'clinicId', AttributeType: 'S' }
		],
		GlobalSecondaryIndexes: [
			{
				IndexName: 'ClinicTemplatesIndex',
				KeySchema: [
					{ AttributeName: 'clinicId', KeyType: 'HASH' }
				],
				Projection: { ProjectionType: 'ALL' }
			}
		]
	},

	// Settings Table
	[TableNames.SETTINGS]: {
		TableName: TableNames.SETTINGS,
		KeySchema: [
			{ AttributeName: 'id', KeyType: 'HASH' }
		],
		AttributeDefinitions: [
			{ AttributeName: 'id', AttributeType: 'S' },
			{ AttributeName: 'type', AttributeType: 'S' },
			{ AttributeName: 'ownerId', AttributeType: 'S' }
		],
		GlobalSecondaryIndexes: [
			{
				IndexName: 'TypeIndex',
				KeySchema: [
					{ AttributeName: 'type', KeyType: 'HASH' }
				],
				Projection: { ProjectionType: 'ALL' }
			},
			{
				IndexName: 'OwnerIndex',
				KeySchema: [
					{ AttributeName: 'ownerId', KeyType: 'HASH' }
				],
				Projection: { ProjectionType: 'ALL' }
			}
		]
	}
}
