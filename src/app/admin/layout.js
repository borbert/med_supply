import { Metadata } from "next"
import { redirect } from "next/navigation"

/**
 * Admin Layout
 * 
 * Layout wrapper for admin pages with authentication check
 */

export const metadata = {
  title: "Admin Dashboard",
  description: "Medical Supply Admin Dashboard",
}

export default async function AdminLayout({ children }) {
  // TODO: Add authentication check here
  // const session = await getSession()
  // if (!session?.user?.isAdmin) {
  //   redirect("/")
  // }

  return (
    <div className="flex h-screen">
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-gray-100/40 dark:bg-gray-800/40">
          {/* Add sidebar navigation items here if needed */}
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
