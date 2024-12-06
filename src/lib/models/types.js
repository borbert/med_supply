/**
 * Core Type Definitions
 * 
 * This file contains JSDoc type definitions for all core data models
 * used throughout the application.
 */

/**
 * @typedef {Object} UserSettings
 * @property {boolean} emailNotifications - Whether the user receives email notifications
 * @property {boolean} stockAlerts - Whether the user receives stock alerts
 * @property {boolean} orderUpdates - Whether the user receives order updates
 * @property {string} timezone - User's preferred timezone
 * @property {string} currency - User's preferred currency
 * @property {string} dateFormat - User's preferred date format
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} email - User's email address
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {'admin' | 'manager' | 'staff'} role - User's role
 * @property {string} clinicId - Associated clinic ID
 * @property {UserSettings} settings - User preferences
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} Address
 * @property {string} street - Street address
 * @property {string} city - City name
 * @property {string} state - State/province
 * @property {string} zipCode - Postal/ZIP code
 * @property {string} country - Country name
 */

/**
 * @typedef {Object} ClinicSettings
 * @property {boolean} orderApprovalRequired - Whether orders need approval
 * @property {number} lowStockThreshold - Threshold for low stock alerts
 * @property {boolean} autoReorder - Whether auto-reordering is enabled
 * @property {string} defaultCurrency - Preferred currency
 * @property {string} dateFormat - Preferred date format
 */

/**
 * @typedef {Object} Clinic
 * @property {string} id - Unique identifier
 * @property {string} name - Clinic name
 * @property {Address} address - Clinic address
 * @property {string} phone - Contact phone number
 * @property {string} email - Contact email
 * @property {ClinicSettings} settings - Clinic preferences
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Unique identifier
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {string} category - Product category
 * @property {string} manufacturer - Manufacturer name
 * @property {string} sku - Stock keeping unit
 * @property {number} price - Unit price
 * @property {string} unit - Unit of measurement
 * @property {number} minStock - Minimum stock quantity
 * @property {string} imageUrl - Product image URL
 * @property {boolean} isActive - Whether the product is active
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} ProductStock
 * @property {string} productId - Product identifier
 * @property {string} clinicId - Clinic identifier
 * @property {number} quantity - Current stock quantity
 * @property {string} lastUpdated - Last update timestamp
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Unique identifier
 * @property {string} clinicId - Ordering clinic ID
 * @property {string} userId - Ordering user ID
 * @property {Array<OrderItem>} items - Order items
 * @property {'draft' | 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled'} status - Order status
 * @property {number} subtotal - Subtotal amount
 * @property {number} tax - Tax amount
 * @property {number} total - Total order amount
 * @property {string} notes - Order notes
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} productId - Product identifier
 * @property {number} quantity - Ordered quantity
 * @property {number} price - Unit price at time of order
 * @property {number} total - Total item amount
 */

/**
 * @typedef {Object} Template
 * @property {string} id - Unique identifier
 * @property {string} clinicId - Clinic identifier
 * @property {string} name - Template name
 * @property {string} description - Template description
 * @property {Array<TemplateItem>} items - Template items
 * @property {string} createdBy - User who created the template
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} TemplateItem
 * @property {string} productId - Product identifier
 * @property {number} quantity - Quantity
 */

/**
 * @typedef {Object} Settings
 * @property {string} id - Unique identifier
 * @property {'global' | 'clinic'} type - Type of settings
 * @property {string} [ownerId] - Clinic ID for clinic-specific settings
 * @property {Record} config - Configuration
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */
