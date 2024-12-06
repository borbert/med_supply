'use client'

import { useState, useEffect } from 'react'

/**
 * Admin page component
 * @returns {JSX.Element} Admin page
 */
export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, clinicsData] = await Promise.all([
          adminService.listUsers(),
          adminService.listClinics()
        ])
        setUsers(usersData)
        setClinics(clinicsData)
      } catch (error) {
        console.error("Error loading admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  /**
   * Handle user status update
   * @param {string} userId - User ID
   * @param {boolean} enable - New status
   */
  const handleUpdateUserStatus = async (userId, enable) => {
    try {
      await adminService.updateUserStatus(userId, enable)
      // Refresh users list
      const updatedUsers = await adminService.listUsers()
      setUsers(updatedUsers)
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  /**
   * Handle clinic creation
   */
  const handleCreateClinic = async () => {
    // TODO: Implement clinic creation modal/form
    try {
      await adminService.createClinic({
        name: "New Clinic",
        address: "789 New St",
        phone: "(555) 000-0000",
        status: "Active"
      })
      // Refresh clinics list
      const updatedClinics = await adminService.listClinics()
      setClinics(updatedClinics)
    } catch (error) {
      console.error("Error creating clinic:", error)
    }
  }

  /**
   * Handle user creation
   */
  const handleCreateUser = async () => {
    // TODO: Implement user creation modal/form
    try {
      await adminService.createUser("newuser@example.com", "New User", "User")
      // Refresh users list
      const updatedUsers = await adminService.listUsers()
      setUsers(updatedUsers)
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  if (loading) {
    return 'Loading...'
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Overview</h2>
          </div>
          <div className="rounded-md border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold">Total Users</h3>
              <p className="text-md">{users.length}</p>
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold">Active Clinics</h3>
              <p className="text-md">{clinics.filter(clinic => clinic.status === "Active").length}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">User Management</h2>
            <Button onClick={handleCreateUser}>Add User</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <Button variant="ghost" onClick={() => handleUpdateUserStatus(user.id, !user.status === "Active")}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Clinic Management</h2>
            <Button onClick={handleCreateClinic}>Add Clinic</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.map((clinic) => (
                  <TableRow key={clinic.id}>
                    <TableCell>{clinic.name}</TableCell>
                    <TableCell>{clinic.address}</TableCell>
                    <TableCell>{clinic.phone}</TableCell>
                    <TableCell>{clinic.status}</TableCell>
                    <TableCell>
                      <Button variant="ghost">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Admin Settings</h2>
          </div>
          <div className="rounded-md border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold">Email Notifications</h3>
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold">Maintenance Mode</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
