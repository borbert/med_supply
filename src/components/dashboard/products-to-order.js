'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Package } from 'lucide-react'
import { inventoryService } from '@/services/inventory'

/**
 * Products to Order Component
 * @param {Object} props
 * @param {boolean} [props.isAdmin=false] - Whether the user is an admin
 * @param {string} [props.clinicId] - ID of the clinic
 */
export function ProductsToOrder({ isAdmin = false, clinicId }) {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])

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
            <Package className="h-5 w-5" />
            Products to Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Products to Order ({products.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No products need ordering at this time
          </p>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      In Stock: {product.quantity}
                      •
                      Reorder at: {product.reorderPoint}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
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
