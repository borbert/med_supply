/**
 * AWS Setup Test Script
 * 
 * Tests AWS configuration, DynamoDB tables, and Cognito setup
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider'
import { TableNames } from '../src/lib/aws-config'
import { randomUUID } from 'crypto'

// Debug: Print environment variables
console.log('Environment Variables:')
console.log('AWS_REGION:', process.env.NEXT_PUBLIC_AWS_REGION)
console.log('AWS_ACCESS_KEY_ID:', process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID?.substring(0, 5) + '...')
console.log('AWS_SECRET_ACCESS_KEY:', process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ? '***' : 'undefined')
console.log('COGNITO_USER_POOL_ID:', process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID)

// Initialize DynamoDB clients
const dynamoClient = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
  }
})

const docClient = DynamoDBDocumentClient.from(dynamoClient)

// Initialize Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
  }
})

async function testDynamoDB() {
  console.log('\n🔍 Testing DynamoDB Connection...')
  
  try {
    // First, let's check if we can scan the tables
    console.log('\nListing available tables...')
    for (const tableName of Object.values(TableNames)) {
      try {
        const scanResult = await docClient.send(new ScanCommand({
          TableName: tableName,
          Limit: 1
        }))
        console.log(`✅ Table ${tableName} exists and is accessible`)
        console.log(`   Items found: ${scanResult.Items?.length || 0}`)
        
        if (scanResult.Items?.length) {
          console.log('   Sample item:', JSON.stringify(scanResult.Items[0], null, 2))
        }
      } catch (error: any) {
        if (error.name === 'ResourceNotFoundException') {
          console.error(`❌ Table ${tableName} does not exist`)
        } else {
          console.error(`❌ Error accessing table ${tableName}:`, error)
        }
      }
    }

    // Test user table operations with a unique ID
    const testUser = {
      id: `test-${randomUUID()}`,
      email: 'test@example.com',
      name: 'Test User',
      clinicId: 'test-clinic-1',
      role: 'STAFF',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Create
    console.log('\nTesting User table operations...')
    console.log('Testing CREATE operation...')
    await docClient.send(new PutCommand({
      TableName: TableNames.USERS,
      Item: testUser
    }))
    console.log('✅ CREATE successful')

    // Read
    console.log('Testing READ operation...')
    const getResult = await docClient.send(new GetCommand({
      TableName: TableNames.USERS,
      Key: { id: testUser.id }
    }))
    console.log('✅ READ successful:', getResult.Item)

    // Delete (cleanup)
    console.log('Testing DELETE operation...')
    await docClient.send(new DeleteCommand({
      TableName: TableNames.USERS,
      Key: { id: testUser.id }
    }))
    console.log('✅ DELETE successful')

    console.log('✅ DynamoDB tests passed!')
  } catch (error) {
    console.error('❌ DynamoDB test failed:', error)
    throw error
  }
}

async function testCognito() {
  console.log('\n🔍 Testing Cognito Configuration...')
  
  try {
    const command = new ListUsersCommand({
      UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      Limit: 1
    })

    const response = await cognitoClient.send(command)
    console.log('✅ Successfully connected to Cognito User Pool')
    console.log(`✅ Found ${response.Users?.length || 0} users`)
    if (response.Users?.length) {
      // Only show safe attributes
      const safeUser = {
        Username: response.Users[0].Username,
        UserStatus: response.Users[0].UserStatus,
        Enabled: response.Users[0].Enabled,
        UserCreateDate: response.Users[0].UserCreateDate
      }
      console.log('Sample user:', JSON.stringify(safeUser, null, 2))
    }
  } catch (error) {
    console.error('❌ Cognito test failed:', error)
    throw error
  }
}

async function runTests() {
  console.log('🚀 Starting AWS configuration tests...')
  
  try {
    await testDynamoDB()
    await testCognito()
    console.log('\n✅ All AWS configuration tests passed!')
  } catch (error) {
    console.error('\n❌ AWS configuration tests failed:', error)
    process.exit(1)
  }
}

// Run the tests
runTests()
