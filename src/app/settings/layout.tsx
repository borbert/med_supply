import AuthenticatedLayout from '../layout.authenticated'

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
