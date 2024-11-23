'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthenticatedLayout({
	children
}: {
	children: React.ReactNode
}) {
	const router = useRouter()

	useEffect(() => {
		// Check if user is authenticated
		const token = localStorage.getItem('accessToken')
		if (!token) {
			router.push('/login')
			return
		}
	}, [router])

	return (
		<div className="min-h-screen bg-gray-100">
			<nav className="bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 justify-between">
						<div className="flex">
							<div className="flex flex-shrink-0 items-center">
								<span className="text-xl font-bold">MedSupply</span>
							</div>
							<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
								<a href="/dashboard" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
									Dashboard
								</a>
								<a href="/inventory" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
									Inventory
								</a>
								<a href="/orders" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
									Orders
								</a>
								<a href="/settings" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
									Settings
								</a>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	)
}
