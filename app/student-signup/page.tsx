'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function StudentSignup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
    mobile: '',
    profilePhoto: null as File | null,
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'profilePhoto' && files) {
      setFormData(prev => ({ ...prev, profilePhoto: files[0] }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const formDataToSend = new FormData()
    formDataToSend.append('username', formData.username)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('password', formData.password)
    formDataToSend.append('mobile', formData.mobile)
    if (formData.profilePhoto) {
      formDataToSend.append('photo', formData.profilePhoto)
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/student-login')
      } else {
        setError(data.message || 'Signup failed')
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
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Student Signup</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
            <Input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
            <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 font-bold mb-2">Address</label>
            <Input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-gray-700 font-bold mb-2">Mobile Number</label>
            <Input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div className="mb-6">
            <label htmlFor="profilePhoto" className="block text-gray-700 font-bold mb-2">Profile Photo (JPG or PNG)</label>
            <Input type="file" id="profilePhoto" name="profilePhoto" accept=".jpg,.jpeg,.png" onChange={handleChange} required />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">
              Sign Up
            </Button>
          </motion.div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <Link href="/student-login" className="text-amber-600 hover:text-amber-700 font-bold">Log in</Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
