import { CognitoIdentityProviderClient, ListUsersCommand, AdminCreateUserCommand, AdminUpdateUserAttributesCommand, AdminDisableUserCommand, AdminEnableUserCommand } from "@aws-sdk/client-cognito-identity-provider"

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
})

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
}

export interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  status: string
}

export const adminService = {
  // User Management
  async listUsers(): Promise<User[]> {
    try {
      const command = new ListUsersCommand({
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      })
      const response = await cognitoClient.send(command)
      
      return (response.Users || []).map(user => ({
        id: user.Username || "",
        email: user.Attributes?.find(attr => attr.Name === "email")?.Value || "",
        name: user.Attributes?.find(attr => attr.Name === "name")?.Value || "",
        role: user.Attributes?.find(attr => attr.Name === "custom:role")?.Value || "User",
        status: user.Enabled ? "Active" : "Inactive"
      }))
    } catch (error) {
      console.error("Error listing users:", error)
      throw error
    }
  },

  async createUser(email: string, name: string, role: string = "User"): Promise<void> {
    try {
      const command = new AdminCreateUserCommand({
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
          { Name: "custom:role", Value: role },
          { Name: "email_verified", Value: "true" }
        ],
      })
      await cognitoClient.send(command)
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  async updateUserStatus(userId: string, enable: boolean): Promise<void> {
    try {
      const command = enable 
        ? new AdminEnableUserCommand({
            UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
            Username: userId,
          })
        : new AdminDisableUserCommand({
            UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
            Username: userId,
          })
      await cognitoClient.send(command)
    } catch (error) {
      console.error("Error updating user status:", error)
      throw error
    }
  },

  // Clinic Management
  async listClinics(): Promise<Clinic[]> {
    // TODO: Implement DynamoDB or your preferred database query here
    return [
      { 
        id: "1", 
        name: "Main Street Clinic", 
        address: "123 Main St", 
        phone: "(555) 123-4567", 
        status: "Active" 
      },
      { 
        id: "2", 
        name: "Downtown Medical", 
        address: "456 Oak Ave", 
        phone: "(555) 987-6543", 
        status: "Active" 
      },
    ]
  },

  async createClinic(clinic: Omit<Clinic, "id">): Promise<void> {
    // TODO: Implement DynamoDB or your preferred database insertion here
    console.log("Creating clinic:", clinic)
  },

  async updateClinicStatus(clinicId: string, status: string): Promise<void> {
    // TODO: Implement DynamoDB or your preferred database update here
    console.log("Updating clinic status:", { clinicId, status })
  }
}
