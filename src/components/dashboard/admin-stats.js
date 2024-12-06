import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, FileText, Package } from "lucide-react"

/**
 * Admin Stats Component
 * @param {Object} props
 * @param {number} props.outstandingOrders - Number of outstanding orders
 * @param {number} props.lowStockItems - Number of low stock items
 * @param {number} props.pendingReports - Number of pending reports
 */
export function AdminStats({ outstandingOrders, lowStockItems, pendingReports }) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Outstanding Orders
            <Package className="ml-2 h-4 w-4 inline-block" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{outstandingOrders}</div>
            {outstandingOrders > 0 && (
              <Badge variant="destructive">Action Needed</Badge>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Low Stock Items
            <AlertTriangle className="ml-2 h-4 w-4 inline-block" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{lowStockItems}</div>
            {lowStockItems > 0 && (
              <Badge variant="destructive">Reorder Required</Badge>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending GL Reports
            <FileText className="ml-2 h-4 w-4 inline-block" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{pendingReports}</div>
            {pendingReports > 0 && (
              <Badge variant="secondary">Ready for Finance</Badge>
            )}
          </div>
        </CardContent>
      </Card>
      {(outstandingOrders > 0 || lowStockItems > 0 || pendingReports > 0) && (
        <Alert variant="primary" className="mt-4">
          <AlertTitle>Action Items</AlertTitle>
          <AlertDescription>
            {outstandingOrders > 0 && (
              <div>{outstandingOrders} order{outstandingOrders > 1 ? 's' : ''} pending approval</div>
            )}
            {lowStockItems > 0 && (
              <div>{lowStockItems} item{lowStockItems > 1 ? 's' : ''} below minimum stock level</div>
            )}
            {pendingReports > 0 && (
              <div>{pendingReports} financial report{pendingReports > 1 ? 's' : ''} ready for GL posting</div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
