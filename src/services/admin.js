import { v4 as uuidv4 } from 'uuid';

// Mock data
const mockUsers = [
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

const mockClinics = [
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

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {string} role - User role
 * @property {string} status - User status
 */

/**
 * @typedef {Object} Clinic
 * @property {string} id - Clinic ID
 * @property {string} name - Clinic name
 * @property {string} address - Clinic address
 * @property {string} phone - Clinic phone number
 * @property {string} status - Clinic status
 */

// Simulated delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AdminService {
  /**
   * List all users
   * @returns {Promise<User[]>} List of users
   */
  async listUsers() {
    await delay(500); // Simulate API delay
    return mockUsers;
  }

  /**
   * Create a new user
   * @param {string} email - User email
   * @param {string} name - User name
   * @param {string} [role="User"] - User role
   * @returns {Promise<void>}
   */
  async createUser(email, name, role = "User") {
    await delay(500);
    const newUser = {
      id: uuidv4(),
      email,
      name,
      role,
      status: 'active'
    };
    mockUsers.push(newUser);
  }

  /**
   * Update user status
   * @param {string} userId - User ID
   * @param {boolean} enable - Enable or disable user
   * @returns {Promise<void>}
   */
  async updateUserStatus(userId, enable) {
    await delay(500);
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.status = enable ? 'active' : 'disabled';
    }
  }

  /**
   * List all clinics
   * @returns {Promise<Clinic[]>} List of clinics
   */
  async listClinics() {
    await delay(500);
    return mockClinics;
  }

  /**
   * Create a new clinic
   * @param {Object} clinic - Clinic data
   * @returns {Promise<void>}
   */
  async createClinic(clinic) {
    await delay(500);
    const newClinic = {
      ...clinic,
      id: uuidv4()
    };
    mockClinics.push(newClinic);
  }

  /**
   * Update clinic status
   * @param {string} clinicId - Clinic ID
   * @param {string} status - New status
   * @returns {Promise<void>}
   */
  async updateClinicStatus(clinicId, status) {
    await delay(500);
    const clinic = mockClinics.find(c => c.id === clinicId);
    if (clinic) {
      clinic.status = status;
    }
  }
}

export const adminService = new AdminService();
