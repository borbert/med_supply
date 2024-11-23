/**
 * Sign Up Page Component
 * 
 * Provides user registration interface using AWS Cognito.
 * Features:
 * - Clean, centered card layout
 * - AWS Cognito integration
 * - Form validation
 * - Error handling
 * - Password strength requirements
 * 
 * This page is part of the (auth) group in the Next.js App Router,
 * which handles all authentication-related routes.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectItem } from '@/components/ui/select'
import { signUp } from '@/lib/auth'
import { Alert, AlertDescription } from '@/components/ui/alert'

/**
 * Sign Up Page
 * 
 * Renders a centered registration card with:
 * - Title and description
 * - Registration form
 * - Error message display
 * - Loading states
 * 
 * @returns {JSX.Element} The sign up page component
 */
export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'STAFF',
    clinicId: 'default' // This should be replaced with actual clinic selection
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Submitting form data:', formData)
      const response = await signUp(formData.email, formData.password, {
        name: formData.name,
        role: formData.role,
        clinicId: formData.clinicId,
        isActive: 'true'
      })
      console.log('Signup successful:', response)
      
      // Redirect to login page after successful registration
      router.push('/login')
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up for a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
              />
              <p className="text-sm text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                label="Role"
                placeholder="Select a role"
                defaultSelectedKeys={["STAFF"]}
                value={formData.role}
                onChange={(e) => {
                  console.log('Role changed:', e.target.value)
                  setFormData({ ...formData, role: e.target.value })
                }}
                className="max-w-xs"
              >
                <SelectItem key="STAFF" value="STAFF">Staff</SelectItem>
                <SelectItem key="ADMIN" value="ADMIN">Admin</SelectItem>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
