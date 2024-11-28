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

export interface CartItem {
  id: string
  name: string
  description?: string
  sku?: string
  quantity: number
  price: number
  maxQuantity: number
}

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const [isOpen, setIsOpen] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    onCheckout()
    setIsOpen(false)
  }

  const updateQuantity = (itemId: string, delta: number) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return

    const newQuantity = Math.max(0, Math.min(item.maxQuantity, item.quantity + delta))
    onUpdateQuantity(itemId, newQuantity)
  }

  const handleQuantityChange = (itemId: string, value: string) => {
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
        <Button variant="outline" size="sm" className="relative h-8 w-8 p-0">
          <ShoppingCart className="h-4 w-4" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col" aria-describedby="cart-description">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <p id="cart-description" className="text-sm text-muted-foreground">
            Review and manage your selected items
          </p>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-2" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Item</TableHead>
                  <TableHead className="w-[20%]">SKU</TableHead>
                  <TableHead className="w-[20%]">Quantity</TableHead>
                  <TableHead className="text-right w-[15%]">Price</TableHead>
                  <TableHead className="w-[5%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
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
                    <TableCell>{item.sku || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
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
                          size="sm"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
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
        <SheetFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg">${total.toFixed(2)}</span>
          </div>
          <Button 
            className="w-full" 
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
