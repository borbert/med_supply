"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { adminService, type User, type Clinic } from "@/services/admin"

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
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

  const handleUpdateUserStatus = async (userId: string, enable: boolean) => {
    try {
      await adminService.updateUserStatus(userId, enable)
      // Refresh users list
      const updatedUsers = await adminService.listUsers()
      setUsers(updatedUsers)
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="clinics">Clinics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clinics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clinics.filter(clinic => clinic.status === "Active").length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search users..." className="max-w-sm" />
                  <Button onClick={handleCreateUser}>Add User</Button>
                </div>
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
                          <Button variant="ghost" size="sm" onClick={() => handleUpdateUserStatus(user.id, user.status !== "Active")}>Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clinics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Management</CardTitle>
              <CardDescription>Manage registered clinics and their settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search clinics..." className="max-w-sm" />
                  <Button onClick={handleCreateClinic}>Add Clinic</Button>
                </div>
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
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>Configure global system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="notifications">Email Notifications</Label>
                <Switch id="notifications" />
              </div>
              <div className="flex items-center space-x-4">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <Switch id="maintenance" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
