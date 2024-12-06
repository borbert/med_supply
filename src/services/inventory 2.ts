import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
})

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
  sku?: string
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

export const inventoryService = {
  // Admin Functions
  async getGlobalInventory(): Promise<InventoryItem[]> {
    // TODO: Implement DynamoDB query for all inventory items across clinics
    return [
      {
        id: '1',
        name: 'Amoxicillin 500mg',
        category: 'Antibiotics',
        quantity: 200,
        reorderPoint: 100,
        status: 'In Stock',
        orderFrequency: 5,
        price: 25.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Amoxicillin',
        description: 'Amoxicillin 500mg capsules, Bottle of 100',
        sku: 'MED-AMOX-500',
        drugInfo: {
          ndc: '68084-566-01',
          proprietaryName: 'Amoxicillin',
          nonProprietaryName: 'Amoxicillin',
          dosageForm: 'CAPSULE',
          routeOfAdministration: 'ORAL',
          manufacturerName: 'American Health Packaging',
          substanceName: 'AMOXICILLIN',
          strengthNumber: '500',
          strengthUnit: 'mg',
          productType: 'HUMAN PRESCRIPTION DRUG',
          marketingCategory: 'ANDA'
        }
      },
      {
        id: '2',
        name: 'Lisinopril 10mg',
        category: 'Cardiovascular',
        quantity: 300,
        reorderPoint: 150,
        status: 'In Stock',
        orderFrequency: 6,
        price: 15.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Lisinopril',
        description: 'Lisinopril 10mg tablets, Bottle of 90',
        sku: 'MED-LISIN-10',
        drugInfo: {
          ndc: '68180-513-01',
          proprietaryName: 'Lisinopril',
          nonProprietaryName: 'Lisinopril',
          dosageForm: 'TABLET',
          routeOfAdministration: 'ORAL',
          manufacturerName: 'Lupin Pharmaceuticals',
          substanceName: 'LISINOPRIL',
          strengthNumber: '10',
          strengthUnit: 'mg',
          productType: 'HUMAN PRESCRIPTION DRUG',
          marketingCategory: 'ANDA'
        }
      },
      {
        id: '3',
        name: 'Metformin 500mg',
        category: 'Diabetes',
        quantity: 50,
        reorderPoint: 100,
        status: 'Low Stock',
        orderFrequency: 4,
        price: 20.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Metformin',
        description: 'Metformin HCl 500mg tablets, Bottle of 100',
        sku: 'MED-METF-500',
        drugInfo: {
          ndc: '65162-175-10',
          proprietaryName: 'Metformin HCl',
          nonProprietaryName: 'Metformin Hydrochloride',
          dosageForm: 'TABLET',
          routeOfAdministration: 'ORAL',
          manufacturerName: 'Amneal Pharmaceuticals',
          substanceName: 'METFORMIN HYDROCHLORIDE',
          strengthNumber: '500',
          strengthUnit: 'mg',
          productType: 'HUMAN PRESCRIPTION DRUG',
          marketingCategory: 'ANDA'
        }
      },
      {
        id: '4',
        name: 'Omeprazole 20mg DR',
        category: 'Gastrointestinal',
        quantity: 150,
        reorderPoint: 75,
        status: 'In Stock',
        orderFrequency: 3,
        price: 30.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Omeprazole',
        description: 'Omeprazole 20mg delayed-release capsules, Bottle of 30',
        sku: 'MED-OMEP-20',
        drugInfo: {
          ndc: '00378-6150-91',
          proprietaryName: 'Omeprazole',
          nonProprietaryName: 'Omeprazole',
          dosageForm: 'CAPSULE, DELAYED RELEASE',
          routeOfAdministration: 'ORAL',
          manufacturerName: 'Mylan Pharmaceuticals',
          substanceName: 'OMEPRAZOLE',
          strengthNumber: '20',
          strengthUnit: 'mg',
          productType: 'HUMAN PRESCRIPTION DRUG',
          marketingCategory: 'ANDA'
        }
      },
      {
        id: '5',
        name: 'Prednisone 5mg',
        category: 'Corticosteroids',
        quantity: 80,
        reorderPoint: 50,
        status: 'In Stock',
        orderFrequency: 2,
        price: 12.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Prednisone',
        description: 'Prednisone 5mg tablets, Bottle of 100',
        sku: 'MED-PRED-5',
        drugInfo: {
          ndc: '00054-4728-25',
          proprietaryName: 'Prednisone',
          nonProprietaryName: 'Prednisone',
          dosageForm: 'TABLET',
          routeOfAdministration: 'ORAL',
          manufacturerName: 'West-Ward Pharmaceuticals',
          substanceName: 'PREDNISONE',
          strengthNumber: '5',
          strengthUnit: 'mg',
          productType: 'HUMAN PRESCRIPTION DRUG',
          marketingCategory: 'ANDA'
        }
      },
      {
        id: '6',
        name: 'Sertraline 50mg',
        category: 'Mental Health',
        quantity: 25,
        reorderPoint: 50,
        status: 'Low Stock',
        orderFrequency: 4,
        price: 18.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Sertraline',
        description: 'Sertraline HCl 50mg tablets, Bottle of 30',
        sku: 'MED-SERT-50',
        drugInfo: {
          ndc: '00093-7198-56',
          proprietaryName: 'Sertraline HCl',
          nonProprietaryName: 'Sertraline Hydrochloride',
          dosageForm: 'TABLET',
          routeOfAdministration: 'ORAL',
          manufacturerName: 'Teva Pharmaceuticals',
          substanceName: 'SERTRALINE HYDROCHLORIDE',
          strengthNumber: '50',
          strengthUnit: 'mg',
          productType: 'HUMAN PRESCRIPTION DRUG',
          marketingCategory: 'ANDA'
        }
      },
      {
        id: '7',
        name: 'Azithromycin 250mg',
        category: 'Antibiotics',
        quantity: 120,
        reorderPoint: 60,
        status: 'In Stock',
        orderFrequency: 3,
        price: 35.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Azithromycin',
        description: 'Azithromycin 250mg tablets, Bottle of 6',
        sku: 'MED-AZIT-250',
        drugInfo: {
          ndc: '68180-160-06',
          proprietaryName: 'Azithromycin',
          nonProprietaryName: 'Azithromycin',
          dosageForm: 'TABLET',
          routeOfAdministration: 'ORAL',
          manufacturerName: 'Lupin Pharmaceuticals',
          substanceName: 'AZITHROMYCIN',
          strengthNumber: '250',
          strengthUnit: 'mg',
          productType: 'HUMAN PRESCRIPTION DRUG',
          marketingCategory: 'ANDA'
        }
      },
      {
        id: '8',
        name: 'Amlodipine 5mg',
        category: 'Cardiovascular',
        quantity: 200,
        reorderPoint: 100,
        status: 'In Stock',
        orderFrequency: 5,
        price: 15.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Amlodipine',
        description: 'Amlodipine besylate 5mg tablets, Bottle of 90',
        sku: 'MED-AMLO-5',
        drugInfo: {
          ndc: '62332-087-90',
          proprietaryName: 'Amlodipine Besylate',
          nonProprietaryName: 'Amlodipine Besylate',
          dosageForm: 'TABLET',
          routeOfAdministration: 'ORAL',
          manufacturerName: 'Alembic Pharmaceuticals',
          substanceName: 'AMLODIPINE BESYLATE',
          strengthNumber: '5',
          strengthUnit: 'mg',
          productType: 'HUMAN PRESCRIPTION DRUG',
          marketingCategory: 'ANDA'
        }
      },
      {
        id: '9',
        name: 'Gabapentin 300mg',
        category: 'Neurology',
        quantity: 40,
        reorderPoint: 80,
        status: 'Low Stock',
        orderFrequency: 4,
        price: 22.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Gabapentin',
        description: 'Gabapentin 300mg capsules, Bottle of 100',
        sku: 'MED-GABA-300',
        drugInfo: {
          ndc: '69097-833-12',
          proprietaryName: 'Gabapentin',
          nonProprietaryName: 'Gabapentin',
          dosageForm: 'CAPSULE',
          routeOfAdministration: 'ORAL',
          manufacturerName: 'Cipla USA Inc.',
          substanceName: 'GABAPENTIN',
          strengthNumber: '300',
          strengthUnit: 'mg',
          productType: 'HUMAN PRESCRIPTION DRUG',
          marketingCategory: 'ANDA'
        }
      },
      {
        id: '10',
        name: 'Levothyroxine 50mcg',
        category: 'Endocrinology',
        quantity: 180,
        reorderPoint: 90,
        status: 'In Stock',
        orderFrequency: 6,
        price: 16.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Levothyroxine',
        description: 'Levothyroxine sodium 50mcg tablets, Bottle of 90',
        sku: 'MED-LEVO-50',
        drugInfo: {
          ndc: '00074-4133-90',
          proprietaryName: 'Synthroid',
          nonProprietaryName: 'Levothyroxine Sodium',
          dosageForm: 'TABLET',
          routeOfAdministration: 'ORAL',
          manufacturerName: 'AbbVie Inc.',
          substanceName: 'LEVOTHYROXINE SODIUM',
          strengthNumber: '50',
          strengthUnit: 'mcg',
          productType: 'HUMAN PRESCRIPTION DRUG',
          marketingCategory: 'NDA'
        }
      }
    ]
  },

  async getAllOrders(): Promise<Order[]> {
    // TODO: Implement DynamoDB query for all orders across clinics
    return [
      {
        id: 'ORD-001',
        clinicId: '1',
        clinicName: 'Main Street Clinic',
        orderDate: '2024-01-15',
        status: 'Processing',
        items: [
          {
            id: '1',
            name: 'Amoxicillin 500mg',
            quantity: 5,
            price: 25.00
          },
          {
            id: '2',
            name: 'Lisinopril 10mg',
            quantity: 3,
            price: 15.00
          }
        ],
        totalAmount: 170.00
      },
      {
        id: 'ORD-002',
        clinicId: '2',
        clinicName: 'Downtown Medical',
        orderDate: '2024-01-14',
        status: 'Shipped',
        items: [
          {
            id: '3',
            name: 'Metformin 500mg',
            quantity: 2,
            price: 20.00
          }
        ],
        totalAmount: 40.00
      },
      {
        id: 'ORD-003',
        clinicId: '1',
        clinicName: 'Main Street Clinic',
        orderDate: '2024-01-13',
        status: 'Delivered',
        items: [
          {
            id: '4',
            name: 'Omeprazole 20mg DR',
            quantity: 4,
            price: 30.00
          }
        ],
        totalAmount: 120.00
      }
    ]
  },

  async getClinicInventoryStats(): Promise<ClinicInventoryStats[]> {
    // TODO: Implement aggregation query across all clinics
    return [
      {
        clinicId: '1',
        clinicName: 'Main Street Clinic',
        totalItems: 150,
        lowStockItems: 5,
        totalOrderValue: 12500,
        mostOrderedItems: [
          { itemId: '1', itemName: 'Surgical Masks', quantity: 5000 }
        ]
      }
    ]
  },

  // Clinic User Functions
  async getClinicInventory(clinicId: string): Promise<InventoryItem[]> {
    // TODO: Implement DynamoDB query for specific clinic's inventory
    return [
      {
        id: '1',
        name: 'Surgical Masks',
        category: 'PPE',
        quantity: 500,
        reorderPoint: 200,
        status: 'In Stock',
        clinicId,
        lastOrdered: '2024-01-15',
        price: 10.00,
        imageUrl: 'https://placehold.co/400x400/eee/999?text=Surgical Masks',
        description: 'Level 3 Medical Surgical Masks, Box of 50',
        sku: 'PPE-MASK-001'
      }
    ]
  },

  async getClinicOrderTemplates(clinicId: string): Promise<OrderTemplate[]> {
    // TODO: Implement DynamoDB query for clinic's order templates
    return [
      {
        id: '1',
        clinicId,
        name: 'Monthly PPE Order',
        description: 'Standard monthly order for Personal Protective Equipment',
        items: [
          {
            id: 'ppe-1',
            name: 'Nitrile Examination Gloves (M)',
            description: 'Powder-free nitrile examination gloves, medium size. Latex-free, suitable for medical examinations and procedures.',
            defaultQuantity: 1000,
            price: 0.15,
            category: 'PPE',
            sku: 'PPE-GLOVE-M'
          },
          {
            id: 'ppe-2',
            name: 'Surgical Masks Level 2',
            description: 'ASTM Level 2 surgical masks with ear loops. Provides protection against fluids and particulates.',
            defaultQuantity: 500,
            price: 0.45,
            category: 'PPE',
            sku: 'PPE-MASK-L2'
          },
          {
            id: 'ppe-3',
            name: 'Face Shields',
            description: 'Full-length face shields with anti-fog coating. Provides full facial protection against splashes and sprays.',
            defaultQuantity: 100,
            price: 2.50,
            category: 'PPE',
            sku: 'PPE-SHIELD'
          },
          {
            id: 'ppe-4',
            name: 'Disposable Isolation Gowns',
            description: 'Level 2 fluid-resistant isolation gowns. Provides protection against light to moderate fluid exposure.',
            defaultQuantity: 200,
            price: 3.75,
            category: 'PPE',
            sku: 'PPE-GOWN'
          },
          {
            id: 'ppe-5',
            name: 'Bouffant Caps',
            description: 'Lightweight, breathable bouffant caps with elastic band. Provides complete hair coverage.',
            defaultQuantity: 300,
            price: 0.25,
            category: 'PPE',
            sku: 'PPE-CAP'
          },
          {
            id: 'ppe-6',
            name: 'Shoe Covers (Pairs)',
            description: 'Non-skid, fluid-resistant shoe covers. Provides protection against contamination and spills.',
            defaultQuantity: 200,
            price: 0.35,
            category: 'PPE',
            sku: 'PPE-SHOE'
          },
          {
            id: 'ppe-7',
            name: 'N95 Respirators',
            description: 'NIOSH-approved N95 respirators. Provides 95% filtration of airborne particles.',
            defaultQuantity: 100,
            price: 2.95,
            category: 'PPE',
            sku: 'PPE-N95'
          }
        ],
        lastUsed: new Date().toISOString(),
        frequency: 30 // days
      }
    ]
  },

  async getClinicOrders(clinicId: string): Promise<Order[]> {
    // TODO: Implement DynamoDB query for specific clinic's orders
    return [
      {
        id: '1',
        clinicId,
        clinicName: 'Main Street Clinic',
        orderDate: '2024-02-15',
        status: 'Delivered',
        items: [
          {
            id: '1',
            name: 'Surgical Masks',
            quantity: 100,
            price: 10.00
          },
          {
            id: '2',
            name: 'Nitrile Gloves',
            quantity: 50,
            price: 15.00
          }
        ],
        totalAmount: 1750.00
      },
      {
        id: '2',
        clinicId,
        clinicName: 'Main Street Clinic',
        orderDate: '2024-02-01',
        status: 'Shipped',
        items: [
          {
            id: '1',
            name: 'Surgical Masks',
            quantity: 200,
            price: 10.00
          }
        ],
        totalAmount: 2000.00
      }
    ]
  },

  async createOrderTemplate(template: Omit<OrderTemplate, 'id'>): Promise<void> {
    // TODO: Implement DynamoDB create operation
    console.log('Creating order template:', template)
  },

  async updateOrderTemplate(template: OrderTemplate): Promise<void> {
    // TODO: Implement DynamoDB update operation
    console.log('Updating order template:', template)
  },

  // Shared Functions
  async updateInventoryItem(item: InventoryItem): Promise<void> {
    // TODO: Implement DynamoDB update operation
    console.log('Updating inventory item:', item)
  },

  async createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<void> {
    // TODO: Implement DynamoDB create operation
    console.log('Creating inventory item:', item)
  },

  async getFdaDrugInfo(ndc: string): Promise<DrugInfo | null> {
    try {
      const response = await fetch(
        `https://api.fda.gov/drug/ndc.json?search=product_ndc:"${ndc}"&limit=1`
      )
      
      if (!response.ok) {
        throw new Error('FDA API request failed')
      }

      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        return {
          ndc: result.product_ndc,
          proprietaryName: result.brand_name,
          nonProprietaryName: result.generic_name,
          dosageForm: result.dosage_form,
          routeOfAdministration: result.route?.[0],
          manufacturerName: result.labeler_name,
          substanceName: result.active_ingredients?.[0]?.name,
          strengthNumber: result.active_ingredients?.[0]?.strength?.split(' ')?.[0],
          strengthUnit: result.active_ingredients?.[0]?.strength?.split(' ')?.[1],
          productType: result.product_type,
          marketingCategory: result.marketing_category
        }
      }
      
      return null
    } catch (error) {
      console.error('Error fetching FDA drug info:', error)
      return null
    }
  },
}
