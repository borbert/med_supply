'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Plus, Minus } from 'lucide-react'

/**
 * @typedef {Object} OrderTemplateItem
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {number} defaultQuantity
 * @property {number} [price]
 * @property {string} [category]
 * @property {string} [sku]
 */

/**
 * @typedef {Object} OrderTemplate
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {OrderTemplateItem[]} items
 */

/**
 * OrderTemplateModal component
 * @param {Object} props
 * @param {OrderTemplate} props.template - Order template
 * @param {boolean} props.isOpen - Modal open state
 * @param {() => void} props.onClose - Close handler
 * @param {(items: OrderTemplateItem[]) => void} props.onAddToCart - Add to cart handler
 */
export function OrderTemplateModal({ template, isOpen, onClose, onAddToCart }) {
  const [quantities, setQuantities] = useState(
    template?.items.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}) || {}
  )

  // Reset quantities when modal closes or template changes
  useEffect(() => {
    if (!isOpen) {
      setQuantities({})
    }
  }, [isOpen])

  const handleQuantityChange = (itemId, delta) => {
    const item = template.items.find((i) => i.id === itemId)
    if (!item) return

    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, prev[itemId] + delta),
    }))
  }

  const handleQuantityInput = (itemId, value) => {
    const quantity = parseInt(value)
    if (!isNaN(quantity) && quantity >= 0) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: quantity,
      }))
    }
  }

  const handleSubmit = () => {
    const itemsToAdd = template.items
      .filter((item) => quantities[item.id] > 0)
      .map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        sku: item.sku,
        quantity: quantities[item.id],
        price: item.price || 0,
        maxQuantity: 100,
      }))

    if (itemsToAdd.length > 0) {
      onAddToCart(itemsToAdd)
      onClose()
    }
  }

  if (!template) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {template.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${(item.price || 0).toFixed(2)}</TableCell>
                  <TableCell>{item.sku || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={!quantities[item.id] && quantities[item.id] !== 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantities[item.id]}
                        onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                        className="w-16 text-center"
                        min={0}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <div className="text-sm text-gray-500">
                        Default: {item.defaultQuantity}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={template.items.every((item) => !(quantities[item.id] || item.defaultQuantity))}
          >
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
