/**
 * Dashboard Page
 * 
 * Main dashboard view displaying key metrics and statistics for the medical supply system.
 * Shows important information like total orders, product count, active clinics, and growth metrics.
 */

'use client'

import { useSession } from "next-auth/react"
import { AdminStats } from "@/components/dashboard/admin-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ProductsToOrder } from "@/components/dashboard/products-to-order"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Temporary mock data - replace with real data fetching
const mockAdminStats = {
  outstandingOrders: 3,
  lowStockItems: 5,
  pendingReports: 2
}

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
] as const

/**
 * Dashboard Page Component
 * 
 * Renders the main dashboard view with role-specific content.
 */
export default function DashboardPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      {isAdmin ? (
        <>
          <AdminStats {...mockAdminStats} />
          <div className="grid gap-6 md:grid-cols-2">
            <RecentActivity activities={mockRecentActivity} />
            <div className="space-y-6">
              <ProductsToOrder isAdmin={true} />
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>• Review and approve pending orders</p>
                  <p>• Generate inventory reorder report</p>
                  <p>• Process financial reports for GL posting</p>
                  <p>• Update stock minimum levels</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Recent Orders: 0</p>
                <p>Pending Orders: 0</p>
                <p>Completed Orders: 0</p>
              </CardContent>
            </Card>
            <ProductsToOrder isAdmin={false} clinicId={session?.user?.clinicId} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Items in Stock: 0</p>
              <p>Low Stock Alerts: 0</p>
              <p>Last Updated: Never</p>
            </CardContent>
          </Card>
          <RecentActivity activities={[]} />
        </div>
      )}
    </div>
  )
}
