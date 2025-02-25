"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import {
  Brain,
  LayoutDashboard,
  BookOpen,
  Users,
  FileQuestion,
  User,
  Shield,
  Database,
  Cloud,
  Server,
  Lock,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

const data = [
  { month: "Jan", tests: 5 },
  { month: "Feb", tests: 10 },
  { month: "Mar", tests: 7 },
  { month: "Apr", tests: 15 },
  { month: "May", tests: 12 },
  { month: "Jun", tests: 20 },
]

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Assessment", icon: FileQuestion, active: false },
  { name: "Learning", icon: BookOpen, active: false },
  { name: "Community", icon: Users, active: false },
]

const courses = [
  {
    id: 1,
    title: "AI/ML",
    icon: Brain,
    lessons: 13,
    color: "bg-pink-500",
    description: "In this course you will learn from basics to advance of Machine Learning and Artificial Intelligence",
    url: "https://www.w3schools.com/ai/",
  },
  {
    id: 2,
    title: "Cyber Security",
    icon: Shield,
    lessons: 17,
    color: "bg-purple-500",
    description: "A cybersecurity course equips students with essential skills to protect digital assets",
    url: "https://www.w3schools.com/cybersecurity/",
  },
  {
    id: 3,
    title: "Data Analytics",
    icon: Database,
    lessons: 10,
    color: "bg-pink-500",
    description: "In this Data Analytics course, you'll embark on a comprehensive journey into the world of data",
    url: "https://www.w3schools.com/datascience/",
  },
  {
    id: 4,
    title: "AWS",
    icon: Cloud,
    lessons: 9,
    color: "bg-green-500",
    description: "This AWS course is tailored for you, whether you're a beginner or looking to advance your skills",
    url: "https://www.w3schools.com/aws/",
  },
  {
    id: 5,
    title: "Data Science",
    icon: Server,
    lessons: 7,
    color: "bg-pink-500",
    description: "Our Data Science course equips you with essential skills to analyze and interpret data",
    url: "https://www.w3schools.com/datascience/",
  },
  {
    id: 6,
    title: "Ethical Hacking",
    icon: Lock,
    lessons: 11,
    color: "bg-pink-500",
    description: "Explore the world of ethical hacking by learning how to exploit vulnerabilities in systems",
    url: "https://www.w3schools.com/cybersecurity/",
  },
  {
    id: 7,
    title: "Cloud Computing",
    icon: Cloud,
    lessons: 9,
    color: "bg-green-500",
    description: "The Intermediate coding course is perfect for you if you aim to strengthen your cloud skills",
    url: "https://www.w3schools.com/aws/",
  },
  {
    id: 8,
    title: "NLP & Deep Learning",
    icon: MessageSquare,
    lessons: 4,
    color: "bg-purple-500",
    description: "Explore the core of Natural Language Processing (NLP) and Deep Learning in this comprehensive course",
    url: "https://www.w3schools.com/ai/",
  },
]

interface Assessment {
  id: number
  title: string
  questions: number
}

export default function StudentDashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState<number | null>(null)
  const [testsTaken, setTestsTaken] = useState(0)

  const [assessments] = useState<Assessment[]>([
    { id: 1, title: "Mathematics Quiz", questions: 10 },
    { id: 2, title: "Science Test", questions: 15 },
    { id: 3, title: "English Exam", questions: 20 },
  ])

  const startAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment)
    setAnswers({})
    setScore(null)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const submitAssessment = () => {
    if (currentAssessment) {
      const totalQuestions = currentAssessment.questions
      const correctAnswers = Math.floor(Math.random() * (totalQuestions + 1))
      const calculatedScore = (correctAnswers / totalQuestions) * 100
      setScore(calculatedScore)
      setTestsTaken((prevTests) => prevTests + 1)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-[#1f2937] text-white p-6 flex flex-col"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <Button
            variant="ghost"
            className="w-24 h-24 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center mb-4"
            onClick={() => router.push("/student-profile")}
          >
            <Brain className="w-16 h-16 text-[#1f2937]" />
          </Button>
          <h2 className="text-amber-500 text-xl font-semibold">Student@1234</h2>
          <Button
            variant="ghost"
            className="mt-2 text-sm text-gray-300 hover:text-white"
            onClick={() => router.push("/student-profile")}
          >
            <User className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveSection(item.name.toLowerCase())}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
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
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {activeSection === "dashboard" && (
            <>
              {/* Dashboard Title */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">STUDENT DASHBOARD</h1>
                <div className="w-48 h-1 bg-amber-500 mt-2"></div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { title: "Tests Taken", value: testsTaken.toString() },
                  { title: "Highest Score", value: "95%" },
                  { title: "Active Time", value: "45h" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{stat.title}</h3>
                        <p className="text-4xl font-bold text-gray-600">{stat.value}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Graph */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Tests Taken</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="tests"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </>
          )}

          {activeSection === "assessment" && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Assessments</h2>
              {!currentAssessment ? (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{assessment.title}</h3>
                          <p className="text-gray-600">{assessment.questions} questions</p>
                        </div>
                        <Button onClick={() => startAssessment(assessment)} className="bg-amber-500 hover:bg-amber-600">
                          Start Assessment
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">{currentAssessment.title}</h3>
                  {[...Array(currentAssessment.questions)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`question-${index + 1}`}>Question {index + 1}</Label>
                      <Input
                        id={`question-${index + 1}`}
                        value={answers[`question-${index + 1}`] || ""}
                        onChange={(e) => handleAnswerChange(`question-${index + 1}`, e.target.value)}
                        placeholder="Enter your answer"
                      />
                    </div>
                  ))}
                  <Button onClick={submitAssessment} className="bg-amber-500 hover:bg-amber-600">
                    Submit Assessment
                  </Button>
                  {score !== null && (
                    <div className="mt-4 p-4 bg-green-100 rounded-lg">
                      <p className="text-lg font-bold text-green-800">Your Score: {score.toFixed(2)}%</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === "learning" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Available Courses</h2>
                <div className="w-48 h-1 bg-amber-500"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                      <CardContent className="p-0">
                        <div className={`${course.color} p-6 relative overflow-hidden`}>
                          <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                            {course.lessons}x Lessons
                          </div>
                          <course.icon className="w-16 h-16 text-white mb-4" />
                          <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                          <Button
                            className="w-full bg-amber-500 hover:bg-amber-600"
                            onClick={() => window.open(course.url, "_blank")}
                          >
                            View Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Add other sections as needed */}
        </motion.div>
      </div>
    </div>
  )
}

