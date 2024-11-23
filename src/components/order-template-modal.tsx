'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Minus } from 'lucide-react'

interface OrderTemplateItem {
  id: string
  name: string
  description?: string
  defaultQuantity: number
  price?: number
  category?: string
  sku?: string
}

interface OrderTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: {
    id: string
    name: string
    description: string
    items: OrderTemplateItem[]
  } | null
  onAddToCart: (items: Array<{ id: string; name: string; quantity: number; price: number; maxQuantity: number; description?: string; sku?: string }>) => void
}

export function OrderTemplateModal({ isOpen, onClose, template, onAddToCart }: OrderTemplateModalProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  // Reset quantities when modal closes or template changes
  useEffect(() => {
    if (!isOpen) {
      setQuantities({})
    }
  }, [isOpen])

  if (!template) return null

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta)
    }))
  }

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value)
    if (!isNaN(quantity) && quantity >= 0) {
      setQuantities(prev => ({
        ...prev,
        [itemId]: quantity
      }))
    }
  }

  const handleAddToCart = () => {
    const itemsToAdd = template.items
      .filter(item => (quantities[item.id] || 0) > 0)
      .map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        sku: item.sku,
        quantity: quantities[item.id] ?? 0,
        price: item.price ?? 0,
        maxQuantity: 100
      }))

    if (itemsToAdd.length > 0) {
      onAddToCart(itemsToAdd)
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col" aria-describedby="template-description">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription id="template-description">
            {template.description || 'Select items and quantities to add to your cart'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] bg-background sticky top-0">Item</TableHead>
                <TableHead className="w-[20%] bg-background sticky top-0">Unit Price</TableHead>
                <TableHead className="w-[20%] bg-background sticky top-0">SKU</TableHead>
                <TableHead className="text-right w-[20%] bg-background sticky top-0">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {template.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${(item.price || 0).toFixed(2)}</TableCell>
                  <TableCell>{item.sku || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={!quantities[item.id] && quantities[item.id] !== 0}
                        >
                          -
                        </Button>
                        <div className="w-24 flex flex-col items-center gap-1">
                          <Input
                            type="number"
                            value={quantities[item.id] ?? 0}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="w-16 text-center"
                            min={0}
                          />
                          <div className="text-xs text-muted-foreground">
                            Default: {item.defaultQuantity}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={template.items.every(item => !(quantities[item.id] || item.defaultQuantity))}
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
