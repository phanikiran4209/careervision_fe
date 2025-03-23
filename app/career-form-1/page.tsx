"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function CareerForm1() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    gpa: "",
    major: "",
    interestedDomain: "",
    projects: "",
    python: "",
    sql: "",
    java: "",
  })
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  // Load token from localStorage after component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken")
    console.log("Token from localStorage on mount:", storedToken)
    setToken(storedToken)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const dialogVariants = {
    hidden: { opacity: 0, y: "-50%", scale: 0.9 },
    visible: { opacity: 1, y: "-50%", scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: "-60%", scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPrediction(null)

    try {
      console.log("Current token before fetch:", token)
      if (!token) {
        throw new Error("Please login first. No token found.")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/prediction/predict_career`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          Gender: formData.gender,
          Age: Number(formData.age),
          GPA: Number(formData.gpa),
          Major: formData.major,
          "Interested Domain": formData.interestedDomain,
          Projects: formData.projects,
          Python: formData.python,
          SQL: formData.sql,
          Java: formData.java,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit career data")
      }

      const data = await response.json()
      setPrediction(data.prediction)
      setIsDialogOpen(true)
      toast({
        // Unique ID to prevent stacking
        title: "Success",
        description: "Career prediction generated!",
        variant: "success",
      })
    } catch (error: unknown) {
      console.error("Error during prediction:", error)
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "Something went wrong",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRoadmapClick = () => {
    if (prediction) {
      setIsDialogOpen(false)
      setTimeout(() => {
        router.push(`/roadmap?career=${encodeURIComponent(prediction)}`)
      }, 300)
    }
  }

  const handleBackToDashboard = () => {
    setIsDialogOpen(false)
    setTimeout(() => {
      router.push("/student-dashboard")
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-200/20"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Shape Your Career Path
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Unlock personalized career insights with your details
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              required
            >
              <SelectTrigger className="bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-orange-500">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <Input
                placeholder="Age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                className="bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GPA (0-4.0)</label>
              <Input
                placeholder="GPA"
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                required
                className="bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
            <Input
              placeholder="e.g., Computer Science"
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              required
              className="bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interested Domain</label>
            <Input
              placeholder="e.g., Machine Learning"
              value={formData.interestedDomain}
              onChange={(e) => setFormData({ ...formData, interestedDomain: e.target.value })}
              required
              className="bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notable Projects</label>
            <Input
              placeholder="e.g., Bus Tracker App"
              value={formData.projects}
              onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
              required
              className="bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6">
            {["python", "sql", "java"].map((skill) => (
              <div key={skill}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{skill}</label>
                <Select
                  value={formData[skill as keyof typeof formData]}
                  required
                >
                  <SelectTrigger className="bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-orange-500">
                    <SelectValue placeholder={`${skill.toUpperCase()} Skill`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Strong">Strong</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-between pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
              disabled={loading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 text-white hover:bg-orange-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Get Prediction"}
            </Button>
          </motion.div>
        </form>
      </motion.div>

      <AnimatePresence>
        {isDialogOpen && prediction && (
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            style={{ transform: "translateY(-50%)", top: "50%" }}
          >
            <div className="w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-2xl shadow-2xl border border-amber-500/30">
              <h2 className="text-4xl font-bold text-white mb-6 text-center">Your Career Prediction</h2>
              <div className="bg-white/10 p-6 rounded-lg text-center">
                <p className="text-3xl font-semibold text-amber-300 tracking-wide">{prediction}</p>
              </div>
              <div className="flex justify-center mt-8 space-x-4">
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300"
                >
                  Close
                </Button>
                <Button
                  onClick={handleRoadmapClick}
                  className="bg-orange-600 text-white hover:bg-orange-700 transition-all duration-300"
                >
                  View Roadmap
                </Button>
                <Button
                  onClick={handleBackToDashboard}
                  className="bg-orange-600 text-white hover:bg-orange-700 transition-all duration-300"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}