"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CareerForm1() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    careerGoal: "",
    jobType: "",
    desiredSalary: "",
    proficiency: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd want to store this data in a more persistent way
    localStorage.setItem("careerForm1", JSON.stringify(formData))
    router.push("/career-form-2")
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
          <p className="text-gray-600">Career Information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="What is your career goal?"
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              required
            />
          </div>

          <div>
            <Select
              value={formData.jobType}
              onValueChange={(value) => setFormData({ ...formData, jobType: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Preferred Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              placeholder="Desired Salary"
              type="number"
              value={formData.desiredSalary}
              onChange={(e) => setFormData({ ...formData, desiredSalary: e.target.value })}
              required
            />
          </div>

          <div>
            <Select
              value={formData.proficiency}
              onValueChange={(value) => setFormData({ ...formData, proficiency: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Rate your Proficiency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
              Next
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

