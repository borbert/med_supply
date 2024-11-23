import AuthenticatedLayout from '../layout.authenticated'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
