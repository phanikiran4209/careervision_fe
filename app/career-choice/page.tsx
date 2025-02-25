"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CareerChoice() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#1f2937] flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          <span className="text-gray-800">Welcome to </span>
          <span className="text-amber-500">CareerVision</span>
        </h1>

        <div className="space-y-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => router.push("/career-form-1")}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg text-lg"
            >
              Know Your Career
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => router.push("/student-dashboard")}
              variant="outline"
              className="w-full py-3 px-6 rounded-lg text-lg"
            >
              Skip to Dashboard
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

