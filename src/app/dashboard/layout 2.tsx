'use client'

import AuthenticatedLayout from '../layout.authenticated'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<AuthenticatedLayout>
			<div className="flex-1 space-y-4 p-8 pt-6">
				{children}
			</div>
		</AuthenticatedLayout>
	)
}
