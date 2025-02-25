"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Edit2, Share2, Eye, ChevronRight, Plus, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface Section {
  id: string
  title: string
  isEditing: boolean
  isExpanded: boolean
}

export default function StudentProfile() {
  const [sections, setSections] = useState<Section[]>([
    { id: "about", title: "About", isEditing: false, isExpanded: true },
    { id: "resume", title: "Resume", isEditing: false, isExpanded: true },
    { id: "skills", title: "Skills", isEditing: false, isExpanded: true },
    { id: "workExperience", title: "Work Experience", isEditing: false, isExpanded: true },
    { id: "education", title: "Education", isEditing: false, isExpanded: true },
    { id: "responsibilities", title: "Responsibilities", isEditing: false, isExpanded: true },
    { id: "certificate", title: "Certificate", isEditing: false, isExpanded: true },
    { id: "projects", title: "Projects", isEditing: false, isExpanded: true },
    { id: "achievements", title: "Achievements", isEditing: false, isExpanded: true },
    { id: "personalDetails", title: "Personal Details", isEditing: false, isExpanded: true },
  ])

  const [skills] = useState([
    "Photography",
    "SQL",
    "Python",
    "Machine Learning",
    "R",
    "Web Development",
    "Performance Management",
  ])

  const toggleEdit = (sectionId: string) => {
    setSections(
      sections.map((section) => (section.id === sectionId ? { ...section, isEditing: !section.isEditing } : section)),
    )
  }

  const toggleExpand = (sectionId: string) => {
    setSections(
      sections.map((section) => (section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section)),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/placeholder.svg?height=128&width=128"
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Phani Kiran Kolli</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <img src="/placeholder.svg?height=20&width=20" alt="Institution" className="h-5 w-5" />
                    <p className="text-gray-600">
                      Vasireddy Venkatadri Institute of Technology, Namburu, Andhra Pradesh
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Resume</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Edit Profile</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {sections.map((section) => (
              <Card key={section.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <span>{section.title}</span>
                      <ChevronRight
                        className={`h-5 w-5 ml-2 transition-transform ${section.isExpanded ? "rotate-90" : ""}`}
                      />
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => toggleEdit(section.id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {section.id === "about" &&
                    (section.isEditing ? (
                      <Textarea
                        className="w-full"
                        placeholder="Tell us about yourself..."
                        defaultValue="I am a B.Tech/BE student at Vasireddy Venkatadri Institute of Technology, specializing in Computer Science..."
                      />
                    ) : (
                      <p className="text-gray-600">
                        I am a B.Tech/BE student at Vasireddy Venkatadri Institute of Technology, specializing in
                        Computer Science. I am passionate about technology and have a strong foundation in programming
                        languages.
                      </p>
                    ))}

                  {section.id === "skills" && (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Rankings Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Rankings</h3>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    How it works?
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Global Rank</p>
                    <p className="text-2xl font-bold">698914</p>
                    <p className="text-xs text-gray-500">Based on activity</p>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Leaderboard</Button>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Points</p>
                      <p className="font-semibold">60</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Badges</p>
                      <p className="font-semibold">5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Unstop Coins Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Unstop Coins</h3>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    How it works?
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">₿</span>
                    </div>
                    <div>
                      <p className="font-semibold">261</p>
                      <p className="text-sm text-gray-500">Coins</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Redeem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

