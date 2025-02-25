"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CareerForm2() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    status: "",
    skills: "",
    college: "",
    age: "",
    location: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd want to combine this with the data from form 1
    // and send it to your backend
    localStorage.setItem("careerForm2", JSON.stringify(formData))
    router.push("/student-dashboard")
  }

  return (
    <div className="min-h-screen bg-[#1f2937] flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Personalize your Experience</h1>
          <p className="text-gray-600">Basic Information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Are you student or professional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              placeholder="Skills you're Proficient In"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              required
            />
          </div>

          <div>
            <Input
              placeholder="College (If student)"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            />
          </div>

          <div>
            <Input
              placeholder="Age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
            />
          </div>

          <div>
            <Input
              placeholder="State/Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 mt-6">
            Submit
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

