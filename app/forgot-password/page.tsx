'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | undefined>('')
  const router = useRouter()

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/otp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        const data = await response.json()
        setStep(2)
        alert(data.message)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to send OTP')
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  const handleSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/otp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      
      if (response.ok) {
        const data = await response.json()
        setStep(3)
      } else {
        const data = await response.json()
        setError(data.error || 'Invalid or expired OTP')
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      const response = await fetch('http://localhost:5000/otp/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      })
      
      if (response.ok) {
        router.push('/student-login')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to reset password')
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#1f2937] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Forgot Password</h1>
        {step === 1 && (
          <form onSubmit={handleSubmitEmail}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
              <Input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" 
                required 
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">
              Send OTP
            </Button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleSubmitOtp}>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-gray-700 font-bold mb-2">Enter OTP</label>
              <Input 
                type="text" 
                id="otp" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456" 
                required 
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">
              Verify OTP
            </Button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">New Password</label>
              <Input 
                type="password" 
                id="newPassword" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
              <Input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">
              Reset Password
            </Button>
          </form>
        )}
        <div className="mt-6 text-center">
          <Link href="/student-login" className="text-amber-600 hover:text-amber-700">Back to Login</Link>
        </div>
      </motion.div>
    </motion.div>
  )
}