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
import { Plus, AlertTriangle, TrendingUp, Package, Pencil, FolderOpen, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { inventoryService, type InventoryItem, type ClinicInventoryStats, type Order } from '@/services/inventory'
import { Header } from '@/components/header'

export default function InventoryPage() {
  const [isAdmin, setIsAdmin] = useState(false) // TODO: Get from auth context
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [clinicStats, setClinicStats] = useState<ClinicInventoryStats[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const clinicId = '1' // TODO: Get from auth context

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAdmin) {
          const [items, stats] = await Promise.all([
            inventoryService.getGlobalInventory(),
            inventoryService.getClinicInventoryStats()
          ])
          setInventory(items)
          setClinicStats(stats)
        } else {
          const [items, orders] = await Promise.all([
            inventoryService.getClinicInventory(clinicId),
            inventoryService.getClinicOrders(clinicId)
          ])
          setInventory(items)
          setRecentOrders(orders)
        }
      } catch (error) {
        console.error('Error loading inventory data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAdmin, clinicId])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Header
        title="Inventory Management"
        isAdmin={isAdmin}
        showRoleToggle
        onRoleToggle={() => setIsAdmin(!isAdmin)}
      />

      {isAdmin ? (
        // Admin View
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Items
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {inventory.reduce((sum, item) => sum + item.quantity, 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Low Stock Items
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {inventory.filter(item => item.quantity <= item.reorderPoint).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categories
                  </CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(inventory.map(item => item.category)).size}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Value
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Inventory Summary</CardTitle>
                <Button onClick={() => {
                  // TODO: Implement add product functionality
                  console.log('Add product clicked')
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === 'In Stock' ? 'default' : 'destructive'}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
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

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your medical inventory and supplies
                </p>
              </div>
              <Button onClick={() => {
                // TODO: Implement add product functionality
                console.log('Add product clicked')
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {inventory.map((item) => (
                <Card key={item.id} className="flex flex-col overflow-hidden">
                  <div className="relative aspect-square">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 bg-white/90 hover:bg-white p-0"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          console.log('Edit item:', item)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {item.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {item.category}
                        </p>
                      </div>
                      <Badge
                        variant={item.status === 'In Stock' ? 'default' : 'destructive'}
                        className="ml-2"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    {item.drugInfo && (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="font-medium min-w-[100px]">NDC:</span>
                          <span className="text-muted-foreground">{item.drugInfo.ndc}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium min-w-[100px]">Form:</span>
                          <span className="text-muted-foreground">{item.drugInfo.dosageForm}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium min-w-[100px]">Strength:</span>
                          <span className="text-muted-foreground">
                            {item.drugInfo.strengthNumber} {item.drugInfo.strengthUnit}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium min-w-[100px]">Route:</span>
                          <span className="text-muted-foreground">
                            {item.drugInfo.routeOfAdministration}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium min-w-[100px]">Manufacturer:</span>
                          <span className="text-muted-foreground">
                            {item.drugInfo.manufacturerName}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="font-medium min-w-[100px]">Quantity:</span>
                        <span className="text-muted-foreground">{item.quantity}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium min-w-[100px]">Reorder at:</span>
                        <span className="text-muted-foreground">{item.reorderPoint}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium min-w-[100px]">Price:</span>
                        <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        variant={item.quantity <= item.reorderPoint ? "destructive" : "default"}
                        onClick={() => {
                          // TODO: Implement reorder functionality
                          console.log('Reorder item:', item)
                        }}
                      >
                        Reorder
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          // TODO: Implement view history functionality
                          console.log('View history:', item)
                        }}
                      >
                        History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        // Clinic User View
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
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
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                      </TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

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
                          <Button variant="ghost" size="sm">View Details</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
