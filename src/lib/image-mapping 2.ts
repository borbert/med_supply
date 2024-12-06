// Category to image mapping
const categoryMap: { [key: string]: string } = {
  'Antibiotics': 'Medications',
  'Cardiovascular': 'Medications',
  'Diabetes': 'Medications',
  'Gastrointestinal': 'Medications',
  'Corticosteroids': 'Medications',
  'Pain Management': 'Medications',
  'Respiratory': 'Medications',
  'Vaccines': 'Medications',
  'First Aid': 'Bandages and Dressings',
  'Wound Care': 'Bandages and Dressings',
  'Surgical Instruments': 'Surgical Supplies',
  'Diagnostic Tools': 'Diagnostic Equipment',
  'PPE': 'Personal Protective Equipment',
  'Lab Supplies': 'Laboratory Supplies',
  'Patient Care': 'Patient Care'
}

// Default images for each category
const defaultImages: { [key: string]: string[] } = {
  'Medications': [
    '/product-images/medications-1.jpg',
    '/product-images/medications-2.jpg',
    '/product-images/medications-3.jpg',
    '/product-images/medications-4.jpg',
    '/product-images/medications-5.jpg'
  ],
  'Bandages and Dressings': [
    '/product-images/bandages-and-dressings-1.jpg',
    '/product-images/bandages-and-dressings-2.jpg',
    '/product-images/bandages-and-dressings-3.jpg',
    '/product-images/bandages-and-dressings-4.jpg',
    '/product-images/bandages-and-dressings-5.jpg'
  ],
  'Surgical Supplies': [
    '/product-images/surgical-supplies-1.jpg',
    '/product-images/surgical-supplies-2.jpg',
    '/product-images/surgical-supplies-3.jpg',
    '/product-images/surgical-supplies-4.jpg',
    '/product-images/surgical-supplies-5.jpg'
  ],
  'Diagnostic Equipment': [
    '/product-images/diagnostic-equipment-1.jpg',
    '/product-images/diagnostic-equipment-2.jpg',
    '/product-images/diagnostic-equipment-3.jpg',
    '/product-images/diagnostic-equipment-4.jpg',
    '/product-images/diagnostic-equipment-5.jpg'
  ],
  'Personal Protective Equipment': [
    '/product-images/personal-protective-equipment-1.jpg',
    '/product-images/personal-protective-equipment-2.jpg',
    '/product-images/personal-protective-equipment-3.jpg',
    '/product-images/personal-protective-equipment-4.jpg',
    '/product-images/personal-protective-equipment-5.jpg'
  ],
  'Laboratory Supplies': [
    '/product-images/laboratory-supplies-1.jpg',
    '/product-images/laboratory-supplies-2.jpg',
    '/product-images/laboratory-supplies-3.jpg',
    '/product-images/laboratory-supplies-4.jpg',
    '/product-images/laboratory-supplies-5.jpg'
  ],
  'Patient Care': [
    '/product-images/patient-care-1.jpg',
    '/product-images/patient-care-2.jpg',
    '/product-images/patient-care-3.jpg',
    '/product-images/patient-care-4.jpg',
    '/product-images/patient-care-5.jpg'
  ]
}

export function getImageForCategory(category: string): string | undefined {
  const mappedCategory = categoryMap[category] || category
  const images = defaultImages[mappedCategory]

  if (!images || images.length === 0) {
    return undefined
  }

  // Get a random image from the category
  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex]
}
