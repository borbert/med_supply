'use client'

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
import { useState } from 'react'

export interface CartItem {
  id: string
  name: string
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

  const updateQuantity = (itemId: string, delta: number) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return

    const newQuantity = Math.max(0, Math.min(item.maxQuantity, item.quantity + delta))
    onUpdateQuantity(itemId, newQuantity)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
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
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
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
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (!isNaN(value)) {
                              onUpdateQuantity(item.id, Math.min(value, item.maxQuantity))
                            }
                          }}
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
                    <TableCell className="text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
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
        <SheetFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg">${total.toFixed(2)}</span>
          </div>
          <Button 
            className="w-full" 
            disabled={items.length === 0}
            onClick={() => {
              onCheckout()
              setIsOpen(false)
            }}
          >
            Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
