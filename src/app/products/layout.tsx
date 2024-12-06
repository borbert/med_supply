import AuthenticatedLayout from '../layout.authenticated'

export default function ProductsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
