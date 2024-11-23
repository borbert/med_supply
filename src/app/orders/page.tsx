/**
 * Orders Management Page
 * 
 * Provides a comprehensive interface for managing medical supply orders.
 * Features include order listing, filtering, and status management.
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Plus, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Sample order data - will be replaced with DynamoDB data
const orders = [
	{
		id: 'ORD-001',
		clinic: 'Main Street Clinic',
		date: '2024-01-15',
		status: 'Pending',
		total: 1250.00,
		items: 8
	},
	{
		id: 'ORD-002',
		clinic: 'City Medical Center',
		date: '2024-01-14',
		status: 'Approved',
		total: 3450.75,
		items: 12
	},
	{
		id: 'ORD-003',
		clinic: 'West End Hospital',
		date: '2024-01-13',
		status: 'Delivered',
		total: 875.50,
		items: 5
	}
]

const statusColors = {
	Pending: 'bg-yellow-100 text-yellow-800',
	Approved: 'bg-green-100 text-green-800',
	Delivered: 'bg-blue-100 text-blue-800',
	Cancelled: 'bg-red-100 text-red-800'
}

export default function OrdersPage() {
	const [statusFilter, setStatusFilter] = useState<string>('all')

	const filteredOrders = statusFilter === 'all'
		? orders
		: orders.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase())

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold">Orders</h2>
					<p className="text-muted-foreground">Manage and track supply orders</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					New Order
				</Button>
			</div>

			{/* Order Statistics */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{orders.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{orders.filter(order => order.status === 'Pending').length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Value</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{orders.filter(order => order.status === 'Delivered').length}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<Filter className="h-4 w-4" />
					<span className="text-sm font-medium">Filter by Status:</span>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Orders</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="approved">Approved</SelectItem>
						<SelectItem value="delivered">Delivered</SelectItem>
						<SelectItem value="cancelled">Cancelled</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Orders Table */}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Order ID</TableHead>
						<TableHead>Clinic</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Items</TableHead>
						<TableHead className="text-right">Total</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredOrders.map(order => (
						<TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
							<TableCell className="font-medium">{order.id}</TableCell>
							<TableCell>{order.clinic}</TableCell>
							<TableCell>{order.date}</TableCell>
							<TableCell>
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
										statusColors[order.status as keyof typeof statusColors]
									}`}
								>
									{order.status}
								</span>
							</TableCell>
							<TableCell>{order.items}</TableCell>
							<TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
