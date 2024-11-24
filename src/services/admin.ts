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

// Mock data for MVP
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Staff User',
    email: 'staff@example.com',
    role: 'STAFF',
    status: 'Active'
  }
]

const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'Main Clinic',
    address: '123 Main St',
    phone: '555-0123',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Downtown Clinic',
    address: '456 Market St',
    phone: '555-0456',
    status: 'Active'
  }
]

export const adminService = {
  // User Management
  async listUsers(): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockUsers
  },

  async createUser(email: string, name: string, role: string = "User"): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    mockUsers.push({
      id: String(mockUsers.length + 1),
      email,
      name,
      role,
      status: 'Active'
    })
  },

  async updateUserStatus(userId: string, enable: boolean): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const user = mockUsers.find(u => u.id === userId)
    if (user) {
      user.status = enable ? 'Active' : 'Inactive'
    }
  },

  // Clinic Management
  async listClinics(): Promise<Clinic[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockClinics
  },

  async createClinic(clinic: Omit<Clinic, "id">): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    mockClinics.push({
      ...clinic,
      id: String(mockClinics.length + 1)
    })
  },

  async updateClinicStatus(clinicId: string, status: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const clinic = mockClinics.find(c => c.id === clinicId)
    if (clinic) {
      clinic.status = status
    }
  }
}
