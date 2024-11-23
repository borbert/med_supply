/**
 * Session Management Module
 * 
 * This module provides session management functionality using AWS Cognito tokens.
 * It handles token storage, validation, and refresh operations.
 */

import { CognitoIdentityProviderClient, GetUserCommand, GlobalSignOutCommand } from '@aws-sdk/client-cognito-identity-provider'

// AWS Cognito configuration
const REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
const cognitoClient = new CognitoIdentityProviderClient({ region: REGION })

/**
 * Get current user session
 * 
 * Validates the current access token and returns user information
 * 
 * @returns User information if session is valid, null otherwise
 */
export async function getCurrentSession() {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) return null

  try {
    const response = await cognitoClient.send(
      new GetUserCommand({
        AccessToken: accessToken
      })
    )

    if (!response.UserAttributes) return null

    // Convert Cognito attributes to user object
    const userAttributes = response.UserAttributes.reduce((acc, attr) => {
      if (attr.Name && attr.Value) {
        acc[attr.Name] = attr.Value
      }
      return acc
    }, {} as Record<string, string>)

    return {
      id: userAttributes.sub,
      email: userAttributes.email,
      name: userAttributes.name,
      role: userAttributes['custom:role'],
      clinicId: userAttributes['custom:clinicId']
    }
  } catch (error) {
    console.error('Error getting user session:', error)
    return null
  }
}

/**
 * Sign out user
 * 
 * Removes tokens and signs out user from all devices
 */
export async function signOut() {
  const accessToken = localStorage.getItem('accessToken')
  
  try {
    if (accessToken) {
      await cognitoClient.send(
        new GlobalSignOutCommand({
          AccessToken: accessToken
        })
      )
    }
  } catch (error) {
    console.error('Error during sign out:', error)
  } finally {
    // Clear local storage regardless of API call success
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

/**
 * Check if user has required role
 * 
 * @param requiredRole - Required role to check against
 * @returns true if user has required role, false otherwise
 */
export async function hasRole(requiredRole: string) {
  const session = await getCurrentSession()
  return session?.role === requiredRole
}

/**
 * Check if user belongs to clinic
 * 
 * @param clinicId - Clinic ID to check against
 * @returns true if user belongs to clinic, false otherwise
 */
export async function belongsToClinic(clinicId: string) {
  const session = await getCurrentSession()
  return session?.clinicId === clinicId
}
