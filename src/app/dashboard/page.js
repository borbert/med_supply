/**
 * Dashboard Page
 * 
 * Main dashboard view displaying key metrics and statistics for the medical supply system.
 * Shows important information like total orders, product count, active clinics, and growth metrics.
 */

'use client'

import { useEffect, useState } from 'react'
import { AdminStats } from "@/components/dashboard/admin-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ProductsToOrder } from "@/components/dashboard/products-to-order"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Temporary mock data - replace with real data fetching
 */
const mockAdminStats = {
  outstandingOrders: 3,
  lowStockItems: 5,
  pendingReports: 2
}

/**
 * Temporary mock data - replace with real data fetching
 */
const mockRecentActivity = [
  {
    id: '1',
    type: 'order',
    description: 'New order #1234 received from Clinic A',
    timestamp: '2 hours ago',
    status: 'pending'
  },
  {
    id: '2',
    type: 'inventory',
    description: 'Stock level alert: Bandages running low',
    timestamp: '3 hours ago',
    status: 'completed'
  },
  {
    id: '3',
    type: 'report',
    description: 'Monthly financial report generated',
    timestamp: '5 hours ago',
    status: 'approved'
  }
]

/**
 * Dashboard Page Component
 * 
 * Renders the main dashboard view with role-specific content.
 * @returns {JSX.Element} Dashboard page
 */
export default function DashboardPage() {
  const [userData, setUserData] = useState({})

  useEffect(() => {
    // Get user data from localStorage
    const token = localStorage.getItem('accessToken')
    const userDataStr = localStorage.getItem('userData')
    if (userDataStr) {
      try {
        const parsedUserData = JSON.parse(userDataStr)
        setUserData(parsedUserData)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

  const isAdmin = userData?.role === 'admin'

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userData?.name || 'User'}
        </p>
      </div>

      {isAdmin ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AdminStats stats={mockAdminStats} />
          <RecentActivity activity={mockRecentActivity} />
          <ProductsToOrder />
          
          <Card>
            <CardHeader>
              <CardTitle>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Review and approve pending orders</p>
              <p>• Generate inventory reorder report</p>
              <p>• Process financial reports for GL posting</p>
              <p>• Update stock minimum levels</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                My Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Recent Orders: 0</p>
              <p>Pending Orders: 0</p>
              <p>Completed Orders: 0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Items in Stock: 0</p>
              <p>Low Stock Alerts: 0</p>
              <p>Last Updated: Never</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
