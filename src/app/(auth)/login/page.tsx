/**
 * Login Page Component
 * 
 * Provides user authentication interface using AWS Cognito.
 * Features:
 * - Clean, centered card layout
 * - AWS Cognito integration
 * - Error handling and validation
 * - Responsive design
 * 
 * This page is part of the (auth) group in the Next.js App Router,
 * which handles all authentication-related routes.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { signIn } from '@/lib/auth'

/**
 * Login Page
 * 
 * Renders a centered login card with:
 * - Title and description
 * - Email and password inputs
 * - Sign in button
 * - Error message display
 * - Loading states
 * - Link to sign up
 * 
 * @returns {JSX.Element} The login page component
 */
export default function LoginPage() {
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	const searchParams = useSearchParams()
	const redirectPath = searchParams.get('redirect') || '/dashboard'

	useEffect(() => {
		// Check if we already have tokens and redirect if we do
		const token = localStorage.getItem('accessToken')
		if (token) {
			window.location.href = '/dashboard'
		}
	}, [])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)

		const formData = new FormData(e.currentTarget)
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		try {
			const response = await signIn(email, password)
			console.log('Login successful:', response)

			if (response.AuthenticationResult) {
				// Store tokens in localStorage
				localStorage.setItem('accessToken', response.AuthenticationResult.AccessToken)
				localStorage.setItem('idToken', response.AuthenticationResult.IdToken)
				localStorage.setItem('refreshToken', response.AuthenticationResult.RefreshToken)

				// Set cookie for middleware
				document.cookie = `accessToken=${response.AuthenticationResult.AccessToken}; path=/`

				console.log('Setting navigation timeout...')
				
				// Use a timeout to ensure state is updated before navigation
				setTimeout(() => {
					console.log('Executing navigation...')
					window.location.href = '/dashboard'
				}, 100)
			}
		} catch (err: any) {
			console.error('Login error:', err)
			setError(err.message || 'An error occurred during login')
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="w-[400px]">
				<CardHeader>
					<CardTitle>Welcome Back</CardTitle>
					<CardDescription>Sign in to your account</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								required
								className="mt-1"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								required
								className="mt-1"
							/>
						</div>

						<Button type="submit" className="w-full">
							Login
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-muted-foreground">
						Don't have an account?{' '}
						<Link href="/signup" className="text-primary hover:underline">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	)
}
