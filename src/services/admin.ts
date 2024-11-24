import { v4 as uuidv4 } from 'uuid';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active'
  },
  {
    id: '2',
    name: 'Staff User',
    email: 'staff@example.com',
    role: 'staff',
    status: 'active'
  }
];

const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'Main Clinic',
    address: '123 Healthcare St',
    phone: '555-0123',
    status: 'active'
  },
  {
    id: '2',
    name: 'Downtown Clinic',
    address: '456 Market St',
    phone: '555-0456',
    status: 'active'
  }
];

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

// Simulated delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AdminService {
  // User Management
  async listUsers(): Promise<User[]> {
    await delay(500); // Simulate API delay
    return mockUsers;
  }

  async createUser(email: string, name: string, role: string = "User"): Promise<void> {
    await delay(500);
    const newUser: User = {
      id: uuidv4(),
      email,
      name,
      role,
      status: 'active'
    };
    mockUsers.push(newUser);
  }

  async updateUserStatus(userId: string, enable: boolean): Promise<void> {
    await delay(500);
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.status = enable ? 'active' : 'disabled';
    }
  }

  // Clinic Management
  async listClinics(): Promise<Clinic[]> {
    await delay(500);
    return mockClinics;
  }

  async createClinic(clinic: Omit<Clinic, "id">): Promise<void> {
    await delay(500);
    const newClinic: Clinic = {
      ...clinic,
      id: uuidv4()
    };
    mockClinics.push(newClinic);
  }

  async updateClinicStatus(clinicId: string, status: string): Promise<void> {
    await delay(500);
    const clinic = mockClinics.find(c => c.id === clinicId);
    if (clinic) {
      clinic.status = status;
    }
  }
}

export const adminService = new AdminService();
