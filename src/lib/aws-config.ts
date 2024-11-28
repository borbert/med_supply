/**
 * Mock Configuration Module for MVP
 * 
 * This is a temporary configuration for MVP.
 * TODO: Implement proper AWS configuration.
 */

import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDBClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
});

export const dynamoDb = DynamoDBDocumentClient.from(client);

export const TableNames = {
    USERS: 'users'
    // ... other table names
};