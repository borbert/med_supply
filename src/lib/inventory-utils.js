import { getImageForCategory } from './image-mapping'

/**
 * Adds image URLs to inventory items based on their category
 * @param {Array} items - Array of inventory items
 * @returns {Array} Items with added image URLs
 */
export function addImageUrlsToInventoryItems(items) {
  return items.map(item => ({
    ...item,
    imageUrl: item.imageUrl || getImageForCategory(item.category)
  }))
}
