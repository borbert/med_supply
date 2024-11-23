import { InventoryItem } from '@/services/inventory'
import { getImageForCategory } from './image-mapping'

export function addImageUrlsToInventoryItems(items: InventoryItem[]): InventoryItem[] {
  return items.map(item => ({
    ...item,
    imageUrl: item.imageUrl || getImageForCategory(item.category)
  }))
}
