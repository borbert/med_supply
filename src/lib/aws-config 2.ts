/**
 * Mock Configuration Module for MVP
 * 
 * This is a temporary configuration for MVP.
 * TODO: Implement proper AWS configuration.
 */

export const MOCK_CONFIG = {
  region: 'us-east-1',
  tables: {
    users: 'users-table',
    clinics: 'clinics-table',
    orders: 'orders-table',
    inventory: 'inventory-table'
  }
}
