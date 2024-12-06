import AuthenticatedLayout from '../layout.authenticated'

export default function OrdersLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
