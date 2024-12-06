'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Package, Clock, CheckCircle } from 'lucide-react'
import { inventoryService } from '@/services/inventory'
import { Header } from '@/components/header'
import { Cart, type CartItem } from '@/components/cart'
import { OrderDetailsModal } from '@/components/order-details-modal'
import { OrderTemplateModal } from '@/components/order-template-modal'

interface Order {
  id: string
  clinicId: string
  clinicName: string
  orderDate: string
  status: 'pending' | 'approved' | 'shipped' | 'delivered'
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
}

interface OrderTemplate {
  id: string
  name: string
  description: string
  items: Array<{
    id: string
    name: string
    defaultQuantity: number
    price: number
  }>
  lastUsed?: string
  frequency?: number
}

export default function OrdersPage() {
  const [isAdmin, setIsAdmin] = useState(false) // TODO: Get from auth context
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [orderTemplates, setOrderTemplates] = useState<OrderTemplate[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [inventory, setInventory] = useState<any[]>([]) // Add inventory state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<OrderTemplate | null>(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const clinicId = '1' // TODO: Get from auth context

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAdmin) {
          const allOrders = await inventoryService.getAllOrders()
          setOrders(allOrders)
        } else {
          const [clinicOrders, templates, clinicInventory] = await Promise.all([
            inventoryService.getClinicOrders(clinicId),
            inventoryService.getClinicOrderTemplates(clinicId),
            inventoryService.getClinicInventory(clinicId)
          ])
          setOrders(clinicOrders)
          setOrderTemplates(templates)
          setInventory(clinicInventory)
        }
      } catch (error) {
        console.error('Error loading orders data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAdmin, clinicId])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      approved: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100'
    }
    return colors[status]
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Header
        title="Orders Management"
        description={isAdmin ? "Manage all clinic orders" : "View and place orders"}
        isAdmin={isAdmin}
        showRoleToggle
        onRoleToggle={() => setIsAdmin(!isAdmin)}
      />

      {isAdmin ? (
        // Admin View - Order Templates and All Orders
        <div className="space-y-6">
          {/* Order Templates Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order Templates</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and manage order templates for clinics
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Available To</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.description}</TableCell>
                      <TableCell>{template.items.length} items</TableCell>
                      <TableCell>All Clinics</TableCell>
                      <TableCell>{template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : 'Never'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">Manage Access</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* All Clinic Orders Section */}
          <Card>
            <CardHeader>
              <CardTitle>All Clinic Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Clinic Name</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.clinicName}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Clinic User View - Their Orders and Templates
        <Tabs defaultValue="orders" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Cart
              items={cartItems}
              onUpdateQuantity={(itemId, newQuantity) => {
                setCartItems(items =>
                  items.map(item =>
                    item.id === itemId
                      ? { ...item, quantity: newQuantity }
                      : item
                  )
                )
              }}
              onRemoveItem={(itemId) => {
                setCartItems(items => items.filter(item => item.id !== itemId))
              }}
              onCheckout={() => {
                // TODO: Implement checkout logic
                console.log('Checking out with items:', cartItems)
                setCartItems([])
              }}
            />
          </div>
          <TabsList>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="templates">Order Templates</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Orders</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    View and manage your orders
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsOrderDetailsOpen(true)
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Available Order Templates</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Quick order templates for common supplies
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {orderTemplates.map((template) => (
                    <Card key={template.id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {template.items.length} items
                          </div>
                          {template.lastUsed && (
                            <div className="text-sm text-muted-foreground">
                              Last used: {new Date(template.lastUsed).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <div className="p-4 pt-0">
                        <Button
                          className="w-full"
                          onClick={() => {
                            setSelectedTemplate(template)
                            setIsTemplateModalOpen(true)
                          }}
                        >
                          Place Order
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Available Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>In Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const existingItem = cartItems.find(cartItem => cartItem.id === item.id)
                                if (existingItem) {
                                  setCartItems(items =>
                                    items.map(cartItem =>
                                      cartItem.id === item.id
                                        ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, item.quantity) }
                                        : cartItem
                                    )
                                  )
                                } else {
                                  setCartItems(items => [...items, {
                                    id: item.id,
                                    name: item.name,
                                    quantity: 1,
                                    price: item.price || 10.00, // Fallback price if not set
                                    maxQuantity: item.quantity
                                  }])
                                }
                              }}
                              disabled={item.quantity === 0 || cartItems.some(cartItem =>
                                cartItem.id === item.id && cartItem.quantity >= item.quantity
                              )}
                            >
                              Add to Cart
                            </Button>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <OrderDetailsModal
        isOpen={isOrderDetailsOpen}
        onClose={() => {
          setIsOrderDetailsOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
      />

      <OrderTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => {
          setIsTemplateModalOpen(false)
          setSelectedTemplate(null)
        }}
        template={selectedTemplate}
        onAddToCart={(items) => {
          setCartItems(prev => [...prev, ...items])
        }}
      />
    </div>
  )
}
