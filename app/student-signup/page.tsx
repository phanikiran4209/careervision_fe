'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function StudentSignup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    mobile: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Validate mobile number: only allow digits and limit to 10
    if (name === 'mobile') {
      const digitsOnly = value.replace(/\D/g, '') // Remove non-digits
      if (digitsOnly.length > 10) return // Prevent more than 10 digits
      setFormData(prev => ({ ...prev, [name]: digitsOnly }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    setError(null) // Clear error on input change
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate mobile number length before submission
    if (formData.mobile.length !== 10) {
      setError('Mobile number must be exactly 10 digits')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      setLoading(false)

      if (response.ok) {
        setSuccess('Successfully created user!')
        setTimeout(() => {
          router.push('/student-login')
        }, 2000) // Navigate after 2 seconds to show success message
      } else {
        if (data.message === 'Email already exists') {
          setError('Email already taken')
        } else {
          setError('Signup failed. Please try again.')
        }
      }
    } catch (err) {
      setLoading(false)
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
          <span className="text-amber-500 mr-2">│</span> Student Signup
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2 uppercase text-sm">
              Username
            </label>
            <Input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              className="w-full border-2 border-gray-300 rounded-full px-4 py-2 text-gray-700 focus:border-amber-500 focus:ring-0"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2 uppercase text-sm">
              Email
            </label>
            <Input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full border-2 border-gray-300 rounded-full px-4 py-2 text-gray-700 focus:border-amber-500 focus:ring-0"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2 uppercase text-sm">
              Password
            </label>
            <Input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="w-full border-2 border-gray-300 rounded-full px-4 py-2 text-gray-700 focus:border-amber-500 focus:ring-0"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2 uppercase text-sm">
              Mobile Number
            </label>
            <Input 
              type="tel" 
              id="mobile" 
              name="mobile" 
              value={formData.mobile} 
              onChange={handleChange} 
              required 
              className="w-full border-2 border-gray-300 rounded-full px-4 py-2 text-gray-700 focus:border-amber-500 focus:ring-0"
              placeholder="Enter your mobile number"
            />
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="flex items-center p-3 bg-red-100 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center p-3 bg-green-100 text-green-700 rounded-lg">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <span>{success}</span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-full"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link href="/student-login" className="text-amber-500 hover:text-amber-600 font-medium">
              Sign in now
            </Link>
          </p>
          <p className="text-gray-600 text-sm">
            <Link href="/chosen" className="text-gray-600 hover:text-gray-800 flex items-center justify-center">
              <span className="mr-1">←</span> Back to login selection
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}