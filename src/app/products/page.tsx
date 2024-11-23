/**
 * Products Management Page
 * 
 * Provides a comprehensive interface for managing medical supplies and products.
 * Features include product listing, categorization, and stock management.
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Plus, Search } from 'lucide-react'

// Sample product data - will be replaced with DynamoDB data
const products = [
	{
		id: 'PRD-001',
		name: 'Surgical Masks',
		category: 'PPE',
		price: 12.99,
		stock: 1500,
		unit: 'box',
		minStock: 500,
		image: 'https://placehold.co/400x300'
	},
	{
		id: 'PRD-002',
		name: 'Nitrile Gloves',
		category: 'PPE',
		price: 15.99,
		stock: 200,
		unit: 'box',
		minStock: 300,
		image: 'https://placehold.co/400x300'
	},
	{
		id: 'PRD-003',
		name: 'Digital Thermometer',
		category: 'Devices',
		price: 45.99,
		stock: 75,
		unit: 'piece',
		minStock: 20,
		image: 'https://placehold.co/400x300'
	},
	{
		id: 'PRD-004',
		name: 'Bandages',
		category: 'First Aid',
		price: 8.99,
		stock: 800,
		unit: 'pack',
		minStock: 200,
		image: 'https://placehold.co/400x300'
	}
]

const categories = ['All', 'PPE', 'Devices', 'First Aid', 'Medications']

export default function ProductsPage() {
	const [categoryFilter, setCategoryFilter] = useState('All')
	const [searchQuery, setSearchQuery] = useState('')

	const filteredProducts = products
		.filter(product => 
			categoryFilter === 'All' || product.category === categoryFilter
		)
		.filter(product =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.id.toLowerCase().includes(searchQuery.toLowerCase())
		)

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold">Products</h2>
					<p className="text-muted-foreground">Manage medical supplies and inventory</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Product
				</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="flex flex-1 gap-4">
					<div className="relative flex-1 md:max-w-sm">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search products..."
							className="pl-8"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Select value={categoryFilter} onValueChange={setCategoryFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							{categories.map(category => (
								<SelectItem key={category} value={category}>
									{category}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Products Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{filteredProducts.map(product => (
					<Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow">
						<CardHeader>
							<img
								src={product.image}
								alt={product.name}
								className="aspect-video w-full rounded-lg object-cover"
							/>
						</CardHeader>
						<CardContent>
							<div className="space-y-1.5">
								<CardTitle>{product.name}</CardTitle>
								<CardDescription>{product.category}</CardDescription>
							</div>
							<div className="mt-4 space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Price</span>
									<span className="font-semibold">${product.price}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">Stock</span>
									<span className={`font-semibold ${
										product.stock < product.minStock ? 'text-red-500' : 'text-green-500'
									}`}>
										{product.stock} {product.unit}s
									</span>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button variant="outline" className="w-full">
								View Details
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}
