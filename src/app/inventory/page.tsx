/**
 * Inventory Management Page
 * 
 * Provides a comprehensive view of the medical supply inventory system.
 * Features include:
 * - Real-time stock levels
 * - Low stock alerts
 * - Item categorization
 * - Quick add functionality
 */

'use client'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Plus } from 'lucide-react'

/**
 * Sample Inventory Data
 * 
 * Represents the structure of inventory items.
 * Each item includes:
 * - Unique identifier
 * - Product name
 * - Category
 * - Current quantity
 * - Reorder threshold
 * - Stock status
 */
const inventory = [
	{
		id: '1',
		name: 'Surgical Masks',
		category: 'PPE',
		quantity: 1500,
		reorderPoint: 500,
		status: 'In Stock'
	},
	{
		id: '2',
		name: 'Nitrile Gloves',
		category: 'PPE',
		quantity: 200,
		reorderPoint: 300,
		status: 'Low Stock'
	},
	{
		id: '3',
		name: 'Flu Vaccine',
		category: 'Vaccines',
		quantity: 50,
		reorderPoint: 20,
		status: 'In Stock'
	}
]

/**
 * Inventory Page Component
 * 
 * Displays a table of inventory items with their current status.
 * Includes functionality to:
 * - View all inventory items
 * - Add new items
 * - Monitor stock levels
 * - Track reorder points
 */
export default function InventoryPage() {
	return (
		<div className="space-y-8">
			{/* Header with Add Item button */}
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold">Inventory</h2>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Item
				</Button>
			</div>

			{/* Inventory Table */}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Reorder Point</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{inventory.map(item => (
						<TableRow key={item.id}>
							<TableCell className="font-medium">{item.name}</TableCell>
							<TableCell>{item.category}</TableCell>
							<TableCell>{item.quantity}</TableCell>
							<TableCell>{item.reorderPoint}</TableCell>
							<TableCell>
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
										item.status === 'Low Stock'
											? 'bg-red-100 text-red-700'
											: 'bg-green-100 text-green-700'
									}`}
								>
									{item.status}
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
