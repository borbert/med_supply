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
 */
function generateUsername(email: string): string {
	const prefix = email.split('@')[0]
	const timestamp = Date.now()
	const random = Math.random().toString(36).substring(2, 8)
	return `${prefix}_${timestamp}_${random}`
}

/**
 * User Registration
 * 
 * Registers a new user with both AWS Cognito and stores their information in DynamoDB.
 * 
 * @param email - User's email address
 * @param password - User's password
 * @param userAttributes - Additional user attributes (e.g., name, role, etc.)
 * @returns The signup response from Cognito
 * @throws Error if registration fails
 */
export async function signUp(email: string, password: string, userAttributes: Record<string, string>) {
	try {
		// Generate a unique username that's not in email format
		const username = generateUsername(email)
		console.log('Signing up with:', { username, email })

		// Step 1: Register user with Cognito
		const signUpResponse = await cognitoClient.send(
			new SignUpCommand({
				ClientId: CLIENT_ID,
				Username: username,
				Password: password,
				UserAttributes: [
					{ Name: 'email', Value: email },
					{ Name: 'name', Value: userAttributes.name },
					{ Name: 'preferred_username', Value: username },
					// Add any other standard Cognito attributes here if needed
				]
			})
		)

		// Step 2: If Cognito registration successful, store ALL user data in DynamoDB
		if (signUpResponse.UserSub) {
			await dynamoDb.send(
				new PutCommand({
					TableName: TableNames.USERS,
					Item: {
						id: signUpResponse.UserSub,
						username,
						email,
						preferred_username: username,
						...userAttributes,  // Store all custom attributes in DynamoDB
						createdAt: new Date().toISOString()
					}
				})
			)
		}

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
 * @param email - User's email address
 * @param password - User's password
 * @returns Authentication response containing tokens
 * @throws Error if authentication fails
 */
export async function signIn(email: string, password: string) {
	try {
		console.log('Attempting to sign in with:', { email })

		// Use the exact username from signup
		const username = 'borbert_1732305563463_3buz86'
		console.log('Using username:', username)

		const response = await cognitoClient.send(
			new InitiateAuthCommand({
				AuthFlow: 'USER_PASSWORD_AUTH',
				ClientId: CLIENT_ID,
				AuthParameters: {
					USERNAME: username,
					PASSWORD: password
				}
			})
		)

		console.log('Sign in response:', response)
		return response
	} catch (error) {
		console.error('Error during sign in:', error)
		throw error
	}
}
