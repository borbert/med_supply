import AuthenticatedLayout from '../layout.authenticated'

export default function InventoryLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
