import { addImageUrlsToInventoryItems } from "@/lib/inventory-utils"

/**
 * @typedef {Object} InventoryItem
 * @property {string} id - Unique identifier
 * @property {string} name - Item name
 * @property {string} category - Item category
 * @property {number} quantity - Available quantity
 * @property {number} reorderPoint - Reorder point
 * @property {string} status - Item status
 * @property {string} [clinicId] - Optional clinic ID
 * @property {string} [lastOrdered] - Optional last ordered date
 * @property {number} [orderFrequency] - Optional order frequency
 * @property {number} price - Item price
 * @property {string} [imageUrl] - Optional URL to item image
 * @property {Object} [drugInfo] - Optional drug information
 * @property {string} [description] - Optional item description
 */

/**
 * @typedef {Object} OrderTemplate
 * @property {string} id - Unique identifier
 * @property {string} clinicId - Clinic ID
 * @property {string} name - Template name
 * @property {string} [description] - Optional template description
 * @property {Object[]} items - Template items
 * @property {string} [lastUsed] - Optional last used date
 * @property {number} [frequency] - Optional frequency
 */

/**
 * @typedef {Object} ClinicInventoryStats
 * @property {string} clinicId - Clinic ID
 * @property {string} clinicName - Clinic name
 * @property {number} totalItems - Total items
 * @property {number} lowStockItems - Low stock items
 * @property {number} totalOrderValue - Total order value
 * @property {Object[]} mostOrderedItems - Most ordered items
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Unique identifier
 * @property {string} clinicId - Clinic ID
 * @property {string} clinicName - Clinic name
 * @property {string} orderDate - Order date
 * @property {string} status - Order status
 * @property {Object[]} items - Order items
 * @property {number} totalAmount - Total amount
 */

/**
 * @typedef {Object} DrugInfo
 * @property {string} [ndc] - Optional NDC
 * @property {string} [proprietaryName] - Optional proprietary name
 * @property {string} [nonProprietaryName] - Optional non-proprietary name
 * @property {string} [dosageForm] - Optional dosage form
 * @property {string} [routeOfAdministration] - Optional route of administration
 * @property {string} [manufacturerName] - Optional manufacturer name
 * @property {string} [substanceName] - Optional substance name
 * @property {string} [strengthNumber] - Optional strength number
 * @property {string} [strengthUnit] - Optional strength unit
 * @property {string} [productType] - Optional product type
 * @property {string} [marketingCategory] - Optional marketing category
 */

// Mock data for MVP
const mockInventory = [
  {
    id: '1',
    name: 'Bandages',
    category: 'First Aid',
    quantity: 100,
    reorderPoint: 20,
    status: 'In Stock',
    price: 5.99,
    description: 'Sterile adhesive bandages'
  },
  {
    id: '2',
    name: 'Surgical Gloves',
    category: 'PPE',
    quantity: 500,
    reorderPoint: 100,
    status: 'In Stock',
    price: 12.99,
    description: 'Latex-free surgical gloves'
  }
]

const mockTemplates = [
  {
    id: '1',
    clinicId: '1',
    name: 'Basic Supplies',
    description: 'Common medical supplies',
    items: [
      {
        id: '1',
        name: 'Bandages',
        defaultQuantity: 50,
        price: 5.99,
        category: 'First Aid'
      },
      {
        id: '2',
        name: 'Surgical Gloves',
        defaultQuantity: 100,
        price: 12.99,
        category: 'PPE'
      }
    ]
  }
]

const mockOrders = [
  {
    id: '1',
    clinicId: '1',
    clinicName: 'Main Clinic',
    orderDate: new Date().toISOString(),
    status: 'Pending',
    items: [
      {
        id: '1',
        name: 'Bandages',
        quantity: 50,
        price: 5.99
      }
    ],
    totalAmount: 299.50
  }
]

/**
 * Inventory service
 */
export const inventoryService = {
  /**
   * Fetches all inventory items
   * @returns {Promise<InventoryItem[]>} List of inventory items
   */
  async getGlobalInventory() {
    return addImageUrlsToInventoryItems(mockInventory)
  },

  /**
   * Fetches all orders
   * @returns {Promise<Order[]>} List of orders
   */
  async getAllOrders() {
    return mockOrders
  },

  /**
   * Fetches clinic inventory stats
   * @returns {Promise<ClinicInventoryStats[]>} List of clinic inventory stats
   */
  async getClinicInventoryStats() {
    return [
      {
        clinicId: '1',
        clinicName: 'Main Clinic',
        totalItems: mockInventory.length,
        lowStockItems: mockInventory.filter(item => item.quantity <= item.reorderPoint).length,
        totalOrderValue: mockInventory.reduce((sum, item) => sum + item.price * item.quantity, 0),
        mostOrderedItems: [
          {
            itemId: '1',
            itemName: 'Bandages',
            quantity: 500
          }
        ]
      }
    ]
  },

  /**
   * Fetches clinic inventory
   * @param {string} clinicId - Clinic ID
   * @returns {Promise<InventoryItem[]>} List of inventory items
   */
  async getClinicInventory(clinicId) {
    return addImageUrlsToInventoryItems(mockInventory.filter(item => !item.clinicId || item.clinicId === clinicId))
  },

  /**
   * Fetches clinic order templates
   * @param {string} clinicId - Clinic ID
   * @returns {Promise<OrderTemplate[]>} List of order templates
   */
  async getClinicOrderTemplates(clinicId) {
    return mockTemplates.filter(template => template.clinicId === clinicId)
  },

  /**
   * Fetches clinic orders
   * @param {string} clinicId - Clinic ID
   * @returns {Promise<Order[]>} List of orders
   */
  async getClinicOrders(clinicId) {
    return mockOrders.filter(order => order.clinicId === clinicId)
  },

  /**
   * Creates an order template
   * @param {OrderTemplate} template - Order template
   * @returns {Promise<void>}
   */
  async createOrderTemplate(template) {
    mockTemplates.push({
      ...template,
      id: String(mockTemplates.length + 1)
    })
  },

  /**
   * Updates an order template
   * @param {OrderTemplate} template - Order template
   * @returns {Promise<void>}
   */
  async updateOrderTemplate(template) {
    const index = mockTemplates.findIndex(t => t.id === template.id)
    if (index !== -1) {
      mockTemplates[index] = template
    }
  },

  /**
   * Updates an inventory item
   * @param {InventoryItem} item - Inventory item
   * @returns {Promise<void>}
   */
  async updateInventoryItem(item) {
    const index = mockInventory.findIndex(i => i.id === item.id)
    if (index !== -1) {
      mockInventory[index] = item
    }
  },

  /**
   * Creates an inventory item
   * @param {InventoryItem} item - Inventory item
   * @returns {Promise<void>}
   */
  async createInventoryItem(item) {
    mockInventory.push({
      ...item,
      id: String(mockInventory.length + 1)
    })
  },

  /**
   * Fetches FDA drug info
   * @param {string} ndc - NDC
   * @returns {Promise<DrugInfo>} FDA drug info
   */
  async getFdaDrugInfo(ndc) {
    // Mock FDA drug info for MVP
    return {
      ndc,
      proprietaryName: 'Mock Drug',
      nonProprietaryName: 'Mock Generic Name',
      dosageForm: 'Tablet',
      routeOfAdministration: 'Oral',
      manufacturerName: 'Mock Pharma',
      substanceName: 'Mock Substance',
      strengthNumber: '500',
      strengthUnit: 'mg',
      productType: 'HUMAN PRESCRIPTION DRUG',
      marketingCategory: 'NDA'
    }
  }
}
