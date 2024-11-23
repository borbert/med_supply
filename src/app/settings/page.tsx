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

export default function SettingsPage() {
	const [emailNotifications, setEmailNotifications] = useState(true)
	const [stockAlerts, setStockAlerts] = useState(true)
	const [orderUpdates, setOrderUpdates] = useState(true)

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div>
				<h2 className="text-3xl font-bold">Settings</h2>
				<p className="text-muted-foreground">Manage your account and application preferences</p>
			</div>

			{/* Settings Tabs */}
			<Tabs defaultValue="profile" className="space-y-4">
				<TabsList>
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="system">System</TabsTrigger>
				</TabsList>

				{/* Profile Settings */}
				<TabsContent value="profile">
					<Card>
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
							<CardDescription>
								Update your account information and preferences
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<Input id="firstName" placeholder="John" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input id="lastName" placeholder="Doe" />
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="john@example.com" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="clinic">Primary Clinic</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select clinic" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="clinic1">Main Street Clinic</SelectItem>
										<SelectItem value="clinic2">City Medical Center</SelectItem>
										<SelectItem value="clinic3">West End Hospital</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button>Save Changes</Button>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Notification Settings */}
				<TabsContent value="notifications">
					<Card>
						<CardHeader>
							<CardTitle>Notification Preferences</CardTitle>
							<CardDescription>
								Choose how you want to receive updates and alerts
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Email Notifications</Label>
									<p className="text-sm text-muted-foreground">
										Receive updates about your orders via email
									</p>
								</div>
								<Switch
									checked={emailNotifications}
									onCheckedChange={setEmailNotifications}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Low Stock Alerts</Label>
									<p className="text-sm text-muted-foreground">
										Get notified when inventory items are running low
									</p>
								</div>
								<Switch
									checked={stockAlerts}
									onCheckedChange={setStockAlerts}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label>Order Status Updates</Label>
									<p className="text-sm text-muted-foreground">
										Receive notifications about order status changes
									</p>
								</div>
								<Switch
									checked={orderUpdates}
									onCheckedChange={setOrderUpdates}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* System Settings */}
				<TabsContent value="system">
					<Card>
						<CardHeader>
							<CardTitle>System Preferences</CardTitle>
							<CardDescription>
								Configure system-wide settings and defaults
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="timezone">Timezone</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select timezone" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="pt">Pacific Time</SelectItem>
										<SelectItem value="mt">Mountain Time</SelectItem>
										<SelectItem value="ct">Central Time</SelectItem>
										<SelectItem value="et">Eastern Time</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="currency">Currency</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select currency" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="usd">USD ($)</SelectItem>
										<SelectItem value="eur">EUR (€)</SelectItem>
										<SelectItem value="gbp">GBP (£)</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="dateFormat">Date Format</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Select date format" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="mdy">MM/DD/YYYY</SelectItem>
										<SelectItem value="dmy">DD/MM/YYYY</SelectItem>
										<SelectItem value="ymd">YYYY/MM/DD</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button>Save Preferences</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
