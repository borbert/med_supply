/**
 * Settings Management Page
 * 
 * Provides a comprehensive interface for managing application settings.
 * Features include profile management, notification preferences, and system settings.
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

/**
 * Settings page component
 * @returns {JSX.Element} Settings page
 */
export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [stockAlerts, setStockAlerts] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)

  /**
   * Handle notification toggle
   * @param {string} type - Type of notification
   */
  const handleNotificationToggle = (type) => {
    switch (type) {
      case 'emailNotifications':
        setEmailNotifications(!emailNotifications)
        break
      case 'stockAlerts':
        setStockAlerts(!stockAlerts)
        break
      case 'orderUpdates':
        setOrderUpdates(!orderUpdates)
        break
      default:
        break
    }
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and application preferences</p>
      </div>

      {/* Settings Tabs */}
      <Tabs>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent>
          {/* Profile Settings */}
          <div value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" type="text" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" type="text" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryClinic">Primary Clinic</Label>
                    <Select id="primaryClinic">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mainStreetClinic">Main Street Clinic</SelectItem>
                        <SelectItem value="cityMedicalCenter">City Medical Center</SelectItem>
                        <SelectItem value="westEndHospital">West End Hospital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Notification Settings */}
          <div value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive updates and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">Receive updates about your orders via email</div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <div className="text-sm text-muted-foreground">Get notified when inventory items are running low</div>
                  </div>
                  <Switch
                    checked={stockAlerts}
                    onCheckedChange={() => handleNotificationToggle('stockAlerts')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Status Updates</Label>
                    <div className="text-sm text-muted-foreground">Receive notifications about order status changes</div>
                  </div>
                  <Switch
                    checked={orderUpdates}
                    onCheckedChange={() => handleNotificationToggle('orderUpdates')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Settings */}
          <div value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>Configure system-wide settings and defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pacificTime">Pacific Time</SelectItem>
                      <SelectItem value="mountainTime">Mountain Time</SelectItem>
                      <SelectItem value="centralTime">Central Time</SelectItem>
                      <SelectItem value="easternTime">Eastern Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">$ USD</SelectItem>
                      <SelectItem value="eur">€ EUR</SelectItem>
                      <SelectItem value="gbp">£ GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyymmdd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Save Preferences</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
