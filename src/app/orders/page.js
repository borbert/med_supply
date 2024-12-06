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
import { Cart } from '@/components/cart'
import { OrderDetailsModal } from '@/components/order-details-modal'
import { OrderTemplateModal } from '@/components/order-template-modal'

/**
 * Orders page component
 * @returns {JSX.Element} Orders page
 */
export default function OrdersPage() {
  const [isAdmin, setIsAdmin] = useState(false) // TODO: Get from auth context
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [orderTemplates, setOrderTemplates] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [inventory, setInventory] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
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
    return <div>Loading...</div>
  }

  /**
   * Get status color
   * @param {string} status - Order status
   * @returns {string} Status color
   */
  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      approved: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100'
    }
    return colors[status.toLowerCase()] || ''
  }

  return (
    <div className="container mx-auto py-6">
      <Header
        title="Orders Management"
        description={isAdmin ? "Manage all clinic orders" : "View and place orders"}
        isAdmin={isAdmin}
        showRoleToggle
        onRoleToggle={() => setIsAdmin(!isAdmin)}
      />

      {isAdmin ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Templates</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              </div>
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
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.description}</TableCell>
                      <TableCell>{template.items.length} items</TableCell>
                      <TableCell>All Clinics</TableCell>
                      <TableCell>
                        {template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.clinicName}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
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
        </div>
      ) : (
        <div className="grid gap-6">
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

          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="templates">Order Templates</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
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
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
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
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {orderTemplates.map((template) => (
                      <Card key={template.id}>
                        <CardHeader>
                          <CardTitle>{template.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{template.description}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <span>{template.items.length} items</span>
                            {template.lastUsed && (
                              <span className="text-sm text-gray-500">
                                Last used: {new Date(template.lastUsed).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <Button
                            className="mt-4 w-full"
                            onClick={() => {
                              setSelectedTemplate(template)
                              setIsTemplateModalOpen(true)
                            }}
                          >
                            Place Order
                          </Button>
                        </CardContent>
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
                            <div className="flex gap-2">
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
        </div>
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
