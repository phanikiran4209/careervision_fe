"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts"
import {
  LayoutDashboard,
  Users,
  FileQuestion,
  Users2,
  GraduationCap,
  Calendar,
  BookOpen,
  Clock,
  Upload,
  Plus,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const testData = [
  { month: "Jan", tests: 10 },
  { month: "Feb", tests: 20 },
  { month: "Mar", tests: 15 },
  { month: "Apr", tests: 25 },
  { month: "May", tests: 30 },
  { month: "Jun", tests: 45 },
]

const performanceData = [
  { subject: "Math", score: 85 },
  { subject: "Science", score: 92 },
  { subject: "English", score: 78 },
  { subject: "History", score: 88 },
]

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Student Statistics", icon: Users, active: false },
  { name: "Manage Questions", icon: FileQuestion, active: false },
  { name: "Community", icon: Users2, active: false },
  { name: "Courses", icon: GraduationCap, active: false },
  { name: "Scheduling Calendar", icon: Calendar, active: false },
]

interface Assessment {
  id: number
  title: string
  questions: number
}

interface Session {
  id: string
  title: string
  date: string
  type: string
}

interface Course {
  id: string
  moduleName: string
  courseTitle: string
  courseLink?: string
  fileName?: string
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [assessmentTitle, setAssessmentTitle] = useState("")
  const [assessmentFile, setAssessmentFile] = useState<File | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([
    { id: 1, title: "Mathematics Quiz", questions: 10 },
    { id: 2, title: "Science Test", questions: 15 },
    { id: 3, title: "English Exam", questions: 20 },
  ])
  const [sessions, setSessions] = useState<Session[]>([])
  const [courses, setCourses] = useState<Course[]>([])

  const [moduleName, setModuleName] = useState("")
  const [courseTitle, setCourseTitle] = useState("")
  const [courseLink, setCourseLink] = useState("")
  const [courseFile, setCourseFile] = useState<File | null>(null)

  const [sessionTitle, setSessionTitle] = useState("")
  const [sessionDate, setSessionDate] = useState("")
  const [sessionType, setSessionType] = useState("")

  const quickStats = [
    { title: "Tests Taken", value: "150", icon: BookOpen, color: "bg-amber-500" },
    { title: "Total Students", value: "500", icon: Users, color: "bg-white" },
    { title: "Active Students", value: "350", icon: Clock, color: "bg-white" },
    { title: "Total Assessments", value: assessments.length.toString(), icon: FileQuestion, color: "bg-white" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAssessmentFile(e.target.files[0])
    }
  }

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newAssessment: Assessment = {
      id: assessments.length + 1,
      title: assessmentTitle,
      questions: Math.floor(Math.random() * 20) + 5, // Random number of questions between 5 and 24
    }
    setAssessments([...assessments, newAssessment])
    setAssessmentTitle("")
    setAssessmentFile(null)
    alert("Assessment uploaded successfully!")
  }

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      moduleName,
      courseTitle,
      courseLink: courseLink || undefined,
      fileName: courseFile?.name,
    }
    setCourses([...courses, newCourse])
    // Reset form
    setModuleName("")
    setCourseTitle("")
    setCourseLink("")
    setCourseFile(null)
  }

  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSession: Session = {
      id: Math.random().toString(36).substr(2, 9),
      title: sessionTitle,
      date: sessionDate,
      type: sessionType,
    }
    setSessions([...sessions, newSession])
    // Reset form
    setSessionTitle("")
    setSessionDate("")
    setSessionType("")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-[#1f2937] text-white flex flex-col"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo and Title */}
        <div className="p-6">
          <h2 className="text-amber-500 text-2xl font-bold mb-6">Admin Panel</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveSection(item.name.toLowerCase())}
                  className={`flex items-center px-6 py-3 transition-colors w-full text-left ${
                    activeSection === item.name.toLowerCase()
                      ? "bg-amber-500 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* URL Display */}
        <div className="mt-auto p-4">
          <div className="bg-gray-700 p-2 rounded text-sm text-gray-300 break-all">
            https://careervision2.netlify.app/admin/dashboard
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {activeSection === "dashboard" && (
            <>
              {/* Dashboard Title */}
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                  <div className="w-48 h-1 bg-amber-500 mt-2"></div>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Last 30 Days
                  </Button>
                  <Button className="bg-amber-500 hover:bg-amber-600">
                    <FileQuestion className="w-4 h-4 mr-2" />
                    Create New Test
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={`${stat.color} shadow-lg`}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className={`text-xl font-bold ${stat.color === "bg-amber-500" ? "text-white" : "text-gray-800"} mb-2`}
                            >
                              {stat.title}
                            </h3>
                            <p
                              className={`text-4xl font-bold ${stat.color === "bg-amber-500" ? "text-white" : "text-gray-600"}`}
                            >
                              {stat.value}
                            </p>
                          </div>
                          <stat.icon
                            className={`w-8 h-8 ${stat.color === "bg-amber-500" ? "text-white" : "text-amber-500"}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Tests Taken Over Time */}
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tests Taken Over Time</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={testData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="tests"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          dot={{ fill: "#F59E0B", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Performance by Subject */}
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Performance by Subject</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Recent Activities */}
              <motion.div
                className="bg-white rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h3>
                  <div className="divide-y">
                    {[
                      { name: "John Doe", email: "john.doe@example.com" },
                      { name: "Jane Smith", email: "jane.smith@example.com" },
                      { name: "Bob Johnson", email: "bob.johnson@example.com" },
                    ].map((student, index) => (
                      <div key={index} className="py-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">{student.name}</p>
                          <p className="text-sm text-gray-600">Joined - {student.email}</p>
                        </div>
                        <span className="text-sm text-gray-500">Recently</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {activeSection === "manage questions" && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Questions</h2>
              <form onSubmit={handleAssessmentSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="assessmentTitle">Assessment Title</Label>
                  <Input
                    id="assessmentTitle"
                    value={assessmentTitle}
                    onChange={(e) => setAssessmentTitle(e.target.value)}
                    placeholder="Enter assessment title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="assessmentFile">Upload Questions PDF</Label>
                  <Input id="assessmentFile" type="file" onChange={handleFileChange} accept=".pdf" required />
                </div>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Assessment
                </Button>
              </form>
            </div>
          )}

          {activeSection === "courses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Course</h2>
                <div className="w-48 h-1 bg-amber-500"></div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleCourseSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="moduleName">Module Name</Label>
                      <Input
                        id="moduleName"
                        value={moduleName}
                        onChange={(e) => setModuleName(e.target.value)}
                        placeholder="Enter module name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="courseTitle">Course Title</Label>
                      <Input
                        id="courseTitle"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder="Enter course title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="courseFile">Upload Course Material</Label>
                      <Input
                        id="courseFile"
                        type="file"
                        onChange={(e) => e.target.files && setCourseFile(e.target.files[0])}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="courseLink">Course Link (Optional)</Label>
                      <Input
                        id="courseLink"
                        value={courseLink}
                        onChange={(e) => setCourseLink(e.target.value)}
                        placeholder="Enter course link"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Course
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Display added courses */}
              {courses.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Added Courses</h3>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <Card key={course.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-bold">{course.courseTitle}</h4>
                              <p className="text-sm text-gray-600">Module: {course.moduleName}</p>
                              {course.fileName && <p className="text-sm text-gray-500">File: {course.fileName}</p>}
                            </div>
                            {course.courseLink && (
                              <Button variant="outline" onClick={() => window.open(course.courseLink, "_blank")}>
                                View Link
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "scheduling calendar" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Schedule Sessions</h2>
                <div className="w-48 h-1 bg-amber-500"></div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSessionSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTitle">Session Title</Label>
                        <Input
                          id="sessionTitle"
                          value={sessionTitle}
                          onChange={(e) => setSessionTitle(e.target.value)}
                          placeholder="Enter session title"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sessionDate">Date</Label>
                        <Input
                          id="sessionDate"
                          type="date"
                          value={sessionDate}
                          onChange={(e) => setSessionDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sessionType">Select Type</Label>
                        <Select value={sessionType} onValueChange={setSessionType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lecture">Lecture</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="seminar">Seminar</SelectItem>
                            <SelectItem value="exam">Exam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end">
                        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
                          Add Session
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Display upcoming sessions */}
              {sessions.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Sessions</h3>
                    <div className="space-y-4">
                      {sessions.map((session) => (
                        <div key={session.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-bold">{session.title}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(session.date).toLocaleDateString()} - {session.type}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {/* Add other sections as needed */}
        </motion.div>
      </div>
    </div>
  )
}

