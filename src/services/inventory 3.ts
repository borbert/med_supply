import { addImageUrlsToInventoryItems } from "@/lib/inventory-utils"

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  reorderPoint: number
  status: string
  clinicId?: string
  lastOrdered?: string
  orderFrequency?: number
  price: number
  imageUrl?: string
  drugInfo?: DrugInfo
  description?: string
}

export interface OrderTemplate {
  id: string
  clinicId: string
  name: string
  description?: string
  items: {
    id: string
    name: string
    description?: string
    defaultQuantity: number
    price: number
    category?: string
    sku?: string
  }[]
  lastUsed?: string
  frequency?: number
}

export interface ClinicInventoryStats {
  clinicId: string
  clinicName: string
  totalItems: number
  lowStockItems: number
  totalOrderValue: number
  mostOrderedItems: {
    itemId: string
    itemName: string
    quantity: number
  }[]
}

export interface Order {
  id: string
  clinicId: string
  clinicName: string
  orderDate: string
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  items: {
    id: string
    name: string
    quantity: number
    price: number
  }[]
  totalAmount: number
}

export interface DrugInfo {
  ndc?: string
  proprietaryName?: string
  nonProprietaryName?: string
  dosageForm?: string
  routeOfAdministration?: string
  manufacturerName?: string
  substanceName?: string
  strengthNumber?: string
  strengthUnit?: string
  productType?: string
  marketingCategory?: string
}

// Mock data for MVP
const mockInventory: InventoryItem[] = [
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

const mockTemplates: OrderTemplate[] = [
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

const mockOrders: Order[] = [
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

export const inventoryService = {
  // Admin Functions
  async getGlobalInventory(): Promise<InventoryItem[]> {
    return addImageUrlsToInventoryItems(mockInventory)
  },

  async getAllOrders(): Promise<Order[]> {
    return mockOrders
  },

  async getClinicInventoryStats(): Promise<ClinicInventoryStats[]> {
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

  // Clinic User Functions
  async getClinicInventory(clinicId: string): Promise<InventoryItem[]> {
    return addImageUrlsToInventoryItems(mockInventory.filter(item => !item.clinicId || item.clinicId === clinicId))
  },

  async getClinicOrderTemplates(clinicId: string): Promise<OrderTemplate[]> {
    return mockTemplates.filter(template => template.clinicId === clinicId)
  },

  async getClinicOrders(clinicId: string): Promise<Order[]> {
    return mockOrders.filter(order => order.clinicId === clinicId)
  },

  async createOrderTemplate(template: Omit<OrderTemplate, 'id'>): Promise<void> {
    mockTemplates.push({
      ...template,
      id: String(mockTemplates.length + 1)
    })
  },

  async updateOrderTemplate(template: OrderTemplate): Promise<void> {
    const index = mockTemplates.findIndex(t => t.id === template.id)
    if (index !== -1) {
      mockTemplates[index] = template
    }
  },

  // Shared Functions
  async updateInventoryItem(item: InventoryItem): Promise<void> {
    const index = mockInventory.findIndex(i => i.id === item.id)
    if (index !== -1) {
      mockInventory[index] = item
    }
  },

  async createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<void> {
    mockInventory.push({
      ...item,
      id: String(mockInventory.length + 1)
    })
  },

  async getFdaDrugInfo(ndc: string): Promise<DrugInfo | null> {
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
