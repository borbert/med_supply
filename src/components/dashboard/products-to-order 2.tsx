'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Package } from 'lucide-react'
import { inventoryService, type InventoryItem } from '@/services/inventory'

interface ProductsToOrderProps {
  isAdmin?: boolean
  clinicId?: string
}

export function ProductsToOrder({ isAdmin, clinicId }: ProductsToOrderProps) {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<InventoryItem[]>([])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const items = isAdmin
          ? await inventoryService.getGlobalInventory()
          : await inventoryService.getClinicInventory(clinicId || '1')

        // Filter items that need ordering (quantity <= reorderPoint)
        const productsToOrder = items.filter(item => item.quantity <= item.reorderPoint)
        setProducts(productsToOrder)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [isAdmin, clinicId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Products to Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          Loading...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Products to Order ({products.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No products need ordering at this time
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg border flex items-center justify-center bg-muted">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>In Stock: {product.quantity}</span>
                      <span>•</span>
                      <span>Reorder at: {product.reorderPoint}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={product.quantity === 0 ? "destructive" : "warning"}>
                    {product.quantity === 0 ? "Out of Stock" : "Low Stock"}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => {
                      // TODO: Implement order creation
                      console.log('Order product:', product)
                    }}
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
