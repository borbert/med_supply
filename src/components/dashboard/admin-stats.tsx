import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, FileText, Package } from "lucide-react"

interface AdminStatsProps {
  outstandingOrders: number
  lowStockItems: number
  pendingReports: number
}

export function AdminStats({ outstandingOrders, lowStockItems, pendingReports }: AdminStatsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Pending GL Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{pendingReports}</div>
              {pendingReports > 0 && (
                <Badge>Ready for Finance</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {(outstandingOrders > 0 || lowStockItems > 0 || pendingReports > 0) && (
        <Alert>
          <AlertTitle>Action Items</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              {outstandingOrders > 0 && (
                <li>{outstandingOrders} order{outstandingOrders > 1 ? 's' : ''} pending approval</li>
              )}
              {lowStockItems > 0 && (
                <li>{lowStockItems} item{lowStockItems > 1 ? 's' : ''} below minimum stock level</li>
              )}
              {pendingReports > 0 && (
                <li>{pendingReports} financial report{pendingReports > 1 ? 's' : ''} ready for GL posting</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
