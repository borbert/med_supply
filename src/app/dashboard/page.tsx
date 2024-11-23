/**
 * Dashboard Page
 * 
 * Main dashboard view displaying key metrics and statistics for the medical supply system.
 * Shows important information like total orders, product count, active clinics, and growth metrics.
 */

'use client'

/**
 * Dashboard Page Component
 * 
 * Renders the main dashboard view with a cleaner layout.
 */
export default function DashboardPage() {
	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold">Welcome!</h2>
					<p>You are now logged in to the MedSupply system.</p>
				</div>
				<div className="rounded-lg border bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold">Quick Stats</h2>
					<div className="space-y-2">
						<p>Total Orders: 0</p>
						<p>Pending Orders: 0</p>
						<p>Low Stock Items: 0</p>
					</div>
				</div>
				<div className="rounded-lg border bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
					<p>No recent activity</p>
				</div>
			</div>
		</div>
	)
}
