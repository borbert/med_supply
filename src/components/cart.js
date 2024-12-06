'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'

/**
 * @typedef {Object} CartItem
 * @property {string} id - Item ID
 * @property {string} name - Item name
 * @property {string} [description] - Optional item description
 * @property {string} [sku] - Optional SKU
 * @property {number} quantity - Item quantity
 * @property {number} price - Item price
 * @property {number} maxQuantity - Maximum allowed quantity
 */

/**
 * Cart component for managing shopping items
 * @param {Object} props - Component props
 * @param {CartItem[]} props.items - Cart items
 * @param {function(string, number): void} props.onUpdateQuantity - Callback for updating item quantity
 * @param {function(string): void} props.onRemoveItem - Callback for removing an item
 * @param {function(): void} props.onCheckout - Callback for checkout
 * @returns {JSX.Element} Cart component
 */
export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const [isOpen, setIsOpen] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    onCheckout()
    setIsOpen(false)
  }

  /**
   * Update item quantity
   * @param {string} itemId - Item ID
   * @param {number} delta - Quantity change
   */
  const updateQuantity = (itemId, delta) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return

    const newQuantity = Math.max(0, Math.min(item.maxQuantity, item.quantity + delta))
    onUpdateQuantity(itemId, newQuantity)
  }

  /**
   * Handle quantity input change
   * @param {string} itemId - Item ID
   * @param {string} value - New quantity value
   */
  const handleQuantityChange = (itemId, value) => {
    const quantity = parseInt(value)
    if (!isNaN(quantity)) {
      const item = items.find(i => i.id === itemId)
      if (item) {
        onUpdateQuantity(itemId, Math.min(quantity, item.maxQuantity))
      }
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <p className="text-sm text-gray-500">
            Review and manage your selected items
          </p>
        </SheetHeader>
        <div className="mt-8">
          {items.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.sku || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-16 text-center"
                          min={1}
                          max={item.maxQuantity}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <SheetFooter className="mt-8">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Checkout
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
