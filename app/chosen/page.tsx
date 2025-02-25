'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'

export default function ChosenPage() {
  const router = useRouter()
  const [selectedLogin, setSelectedLogin] = useState<string>('')

  const handleLogin = () => {
    if (selectedLogin === 'student') {
      router.push('/student-login')
    } else if (selectedLogin === 'admin') {
      router.push('/admin-login')
    }
  }

  return (
    <div className="min-h-screen bg-[#1f2937] flex flex-col items-center justify-center p-4">
      {/* Logo and Title */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-white">Career</span>
          <span className="text-amber-500">VISION</span>
        </h1>
        <p className="text-amber-500 text-2xl font-script">
          Your Vision, Your Career, Your Future
        </p>
      </motion.div>

      {/* Login Selection Card */}
      <motion.div 
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-center text-amber-500 mb-6">
          Select Login Type
        </h2>
        
        <div className="space-y-6">
          <Select onValueChange={setSelectedLogin}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose login type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student Login</SelectItem>
              <SelectItem value="admin">Admin Login</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={handleLogin}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            disabled={!selectedLogin}
          >
            Go to Login
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

