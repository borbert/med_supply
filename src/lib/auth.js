/**
 * Authentication Module
 * 
 * This module provides authentication functionality using AWS Cognito and DynamoDB.
 * It handles user registration and sign-in processes, ensuring user data is stored
 * both in Cognito and DynamoDB for the application's needs.
 */

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  ListUsersCommand,
  SignUpCommand
} from '@aws-sdk/client-cognito-identity-provider'
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dynamoDb, TableNames } from './aws-config'

// AWS Cognito configuration from environment variables
const REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || ''
const USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || ''

// Initialize Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  region: REGION
})

/**
 * Generate a unique username from an email
 * Format: user_[timestamp]_[random]
 * @param {string} email - User's email address
 * @returns {string} Generated username
 */
function generateUsername(email) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `user_${timestamp}_${random}`
}

/**
 * User Registration
 * 
 * Registers a new user with both AWS Cognito and stores their information in DynamoDB.
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {Object} userAttributes - Additional user attributes (e.g., name, role, etc.)
 * @returns {Promise<Object>} The signup response from Cognito
 * @throws {Error} If registration fails
 */
async function signUp(email, password, userAttributes) {
  try {
    const username = generateUsername(email)

    // Register user with Cognito
    const signUpParams = {
      ClientId: CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        ...Object.entries(userAttributes).map(([key, value]) => ({
          Name: key,
          Value: String(value)
        }))
      ]
    }

    const signUpResponse = await cognitoClient.send(
      new SignUpCommand(signUpParams)
    )

    // Store user data in DynamoDB
    const timestamp = new Date().toISOString()
    const userRecord = {
      id: username,
      email,
      ...userAttributes,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    await dynamoDb.send(
      new PutCommand({
        TableName: TableNames.USERS,
        Item: userRecord
      })
    )

    return signUpResponse
  } catch (error) {
    console.error('Error during sign up:', error)
    throw error
  }
}

/**
 * User Sign In
 * 
 * Authenticates a user using AWS Cognito's USER_PASSWORD_AUTH flow.
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Authentication response containing tokens
 * @throws {Error} If authentication fails
 */
async function signIn(email, password) {
  try {
    // Find username by email
    const listUsersResponse = await cognitoClient.send(
      new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        Filter: `email = "${email}"`,
        Limit: 1
      })
    )

    if (!listUsersResponse.Users || listUsersResponse.Users.length === 0) {
      throw new Error('User not found')
    }

    const username = listUsersResponse.Users[0].Username

    // Authenticate user
    const authParams = {
      ClientId: CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    }

    const authResponse = await cognitoClient.send(
      new InitiateAuthCommand(authParams)
    )

    return authResponse
  } catch (error) {
    console.error('Error during sign in:', error)
    throw error
  }
}

export { signUp, signIn }
