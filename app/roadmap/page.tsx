"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, ChevronRight } from "lucide-react"

// Define the types for the roadmap data
interface RoadmapItem {
  category: string
  subtopics: string[]
}

interface RoadmapResponse {
  career: string
  roadmap: RoadmapItem[]
}

export default function RoadmapPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [roadmapData, setRoadmapData] = useState<RoadmapResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [isRoadmapVisible, setIsRoadmapVisible] = useState(false)
  const [hasShownToast, setHasShownToast] = useState(false) // Track if toast has been shown

  // Get the career from the query parameter
  const career = searchParams.get("career")

  // Load token from localStorage and fetch roadmap
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken")
    console.log("Token from localStorage on mount:", storedToken)
    setToken(storedToken)

    if (!career) {
      toast({
        id: "roadmap-error-no-career",
        title: "Error",
        description: "No career provided",
        variant: "destructive",
        duration: 3000,
      })
      router.push("/student-dashboard")
      return
    }

    if (!storedToken) {
      toast({
        id: "roadmap-error-no-token",
        title: "Error",
        description: "Please login first. No token found.",
        variant: "destructive",
        duration: 3000,
      })
      router.push("/login")
      return
    }

    const fetchRoadmap = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/roadmap/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedToken}`,
          },
          body: JSON.stringify({ career }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch roadmap")
        }

        const data: RoadmapResponse = await response.json()
        setRoadmapData(data)
        setIsRoadmapVisible(true)

        // Show toast only once
        if (!hasShownToast) {
          toast({
            id: "roadmap-success", // Unique ID to prevent stacking
            title: "Success",
            description: "Roadmap generated successfully!",
            variant: "success",
            duration: 3000,
          })
          setHasShownToast(true) // Mark toast as shown
        }
      } catch (error: any) {
        console.error("Error fetching roadmap:", error)
        toast({
          id: "roadmap-error-fetch",
          title: "Error",
          description: error.message || "Failed to fetch roadmap",
          variant: "destructive",
          duration: 3000,
        })
        router.push("/student-dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmap()
  }, [career, router, toast]) // Removed hasShownToast from dependencies to prevent re-fetching

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const subtopicVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const handleBackToDashboard = () => {
    router.push("/student-dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-2xl"
        >
          Loading roadmap...
        </motion.p>
      </div>
    )
  }

  if (!roadmapData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <p className="text-white text-2xl">No roadmap data available.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            Career Roadmap: {roadmapData.career}
          </h1>
          <p className="text-gray-300 mt-3 text-lg">
            Your personalized path to becoming a {roadmapData.career}
          </p>
        </motion.div>

        {/* Roadmap Timeline */}
        <AnimatePresence>
          {isRoadmapVisible && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              {/* Vertical Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500" />

              {roadmapData.roadmap.map((item, index) => (
                <motion.div
                  key={item.category}
                  variants={cardVariants}
                  className="relative mb-8 pl-16"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-4 w-5 h-5 bg-blue-500 rounded-full border-4 border-gray-900" />

                  {/* Category Card */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4">{item.category}</h2>
                    <ul className="space-y-2">
                      {item.subtopics.map((subtopic) => (
                        <motion.li
                          key={subtopic}
                          variants={subtopicVariants}
                          className="flex items-center text-gray-100 text-sm transition-colors hover:text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                          {subtopic}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Dashboard Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            onClick={handleBackToDashboard}
            className="bg-orange-600 text-white hover:bg-orange-700 transition-all duration-300 flex items-center mx-auto"
          >
            Back to Dashboard
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}