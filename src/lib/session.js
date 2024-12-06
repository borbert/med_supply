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
 * @returns {Promise<Object|null>} User information if session is valid, null otherwise
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

    // Convert UserAttributes array to a more usable object
    const userAttributes = {}
    response.UserAttributes.forEach(attr => {
      userAttributes[attr.Name] = attr.Value
    })

    return {
      username: response.Username,
      ...userAttributes
    }
  } catch (error) {
    console.error('Error getting current session:', error)
    localStorage.removeItem('accessToken')
    return null
  }
}

/**
 * Sign out user
 * 
 * Removes tokens and signs out user from all devices
 * 
 * @returns {Promise<void>}
 */
export async function signOut() {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) return

  try {
    // Sign out from all devices
    await cognitoClient.send(
      new GlobalSignOutCommand({
        AccessToken: accessToken
      })
    )
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
 * @param {string} requiredRole - Required role to check against
 * @returns {Promise<boolean>} true if user has required role, false otherwise
 */
export async function hasRole(requiredRole) {
  const session = await getCurrentSession()
  if (!session) return false

  return session.role === requiredRole
}

/**
 * Check if user belongs to clinic
 * 
 * @param {string} clinicId - Clinic ID to check against
 * @returns {Promise<boolean>} true if user belongs to clinic, false otherwise
 */
export async function belongsToClinic(clinicId) {
  const session = await getCurrentSession()
  if (!session) return false

  return session.clinicId === clinicId
}
