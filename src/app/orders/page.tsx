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
  const clinicId = '1' // TODO: Get from auth context

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAdmin) {
          // Admin gets all orders across clinics
          const allOrders = await inventoryService.getAllOrders()
          setOrders(allOrders)
        } else {
          // Clinic user gets their orders and available templates
          const [clinicOrders, templates] = await Promise.all([
            inventoryService.getClinicOrders(clinicId),
            inventoryService.getClinicOrderTemplates(clinicId)
          ])
          setOrders(clinicOrders)
          setOrderTemplates(templates)
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
          <TabsList>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="templates">Order Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Orders</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
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
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <div className="flex items-center text-sm">
                            <Package className="mr-2 h-4 w-4" />
                            {template.items.length} items
                          </div>
                          {template.lastUsed && (
                            <div className="flex items-center text-sm">
                              <Clock className="mr-2 h-4 w-4" />
                              Last used: {new Date(template.lastUsed).toLocaleDateString()}
                            </div>
                          )}
                          <Button className="w-full">
                            Place Order
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
