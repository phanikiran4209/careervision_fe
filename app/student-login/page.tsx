'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function StudentLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(data.redirect) // Redirect to student-dashboard or admin-dashboard
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('An error occurred. Please try again later.')
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
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Student Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
            <Input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username" 
              required 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <Input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">
              Login
            </Button>
          </motion.div>
        </form>
        <div className="mt-6 text-center">
          <Link href="/forgot-password" className="text-amber-600 hover:text-amber-700">Forgot your password?</Link>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <Link href="/student-signup" className="text-amber-600 hover:text-amber-700 font-bold">Sign up now</Link>
        </div>
        <div className="mt-4 text-center">
          <Link href="/chosen" className="text-gray-600 hover:text-amber-500">
            ← Back to login selection
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
