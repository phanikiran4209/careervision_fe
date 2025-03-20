"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
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
  CheckCircle,
  Bell,
  LogOut,
  X,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Assessment", icon: FileQuestion, active: false },
  { name: "Learning", icon: BookOpen, active: false },
  { name: "Community", icon: Users, active: false },
  { name: "Tools", icon: Wrench, active: false },
];

interface Assessment {
  title: string;
  questions: { question: string; options: string[]; correct_answer: string | null }[];
}

interface Course {
  module_name: string;
  course_title: string;
  course_link?: string;
  course_content?: Array<{ title: string; content: string } | string> | string;
  completed_by: string[];
}

interface Session {
  session_title: string;
  session_date: string;
  session_type: string;
}

interface GraphData {
  test_name: string;
  tests: number;
  highest_score: number;
}

const toolItems = [
  { name: "Mock Interviews", icon: MessageSquare, route: "/interview" },
  { name: "Resume ATS Score", icon: Shield, route: "/resume-ats-score" },
  { name: "Model Prediction", icon: Brain, route: "/career-form-1" },
  { name: "Resume Creation", icon: FileQuestion, route: "/resume-creation" },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [testsTaken, setTestsTaken] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [username, setUsername] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showSessionPopup, setShowSessionPopup] = useState(false);

  const fetchDashboardData = async (token: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard/student", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTestsTaken(data.tests_taken);
        setHighestScore(data.highest_score);
        setGraphData(data.graph_data || []);
        setCourses(data.courses || []);
        setSessions(data.sessions || []);
      } else {
        console.error("Failed to fetch dashboard data:", data.message);
      }
    } catch (err) {
      console.error("Fetch dashboard data error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/student-login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/profile/get", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok && data.exists) {
          setUsername(data.profile.username);
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };

    const fetchAssessments = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/admin/assessments", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setAssessments(data.assessments);
        }
      } catch (err) {
        console.error("Fetch assessments error:", err);
      }
    };

    fetchProfile();
    fetchAssessments();
    fetchDashboardData(token);
  }, [router]);

  const startAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setAnswers({});
    setScore(null);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitAssessment = async () => {
    if (currentAssessment) {
      const token = localStorage.getItem("jwtToken");
      const totalQuestions = currentAssessment.questions.length;
      let correctAnswers = 0;

      currentAssessment.questions.forEach((q, index) => {
        if (answers[`question-${index}`] === q.correct_answer) {
          correctAnswers++;
        }
      });

      const calculatedScore = (correctAnswers / totalQuestions) * 100;
      setScore(calculatedScore);

      const assessmentData = {
        username,
        assessment_id: currentAssessment.title,
        score: calculatedScore,
        date: new Date().toISOString(),
      };
      try {
        const response = await fetch("http://127.0.0.1:5000/assessment/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(assessmentData),
        });
        if (response.ok) {
          await fetchDashboardData(token);
        }
      } catch (err) {
        console.error("Submit assessment error:", err);
      }
    }
  };

  const handleProfileClick = () => {
    router.push("/student-profile");
  };

  const handleCourseClick = (course: Course) => {
    if (course.course_link) {
      window.open(course.course_link, "_blank");
    } else if (course.course_content) {
      setSelectedCourse(course);
    }
  };

  const completeCourse = async () => {
    const token = localStorage.getItem("jwtToken");
    if (selectedCourse && username && token) {
      try {
        const response = await fetch("http://127.0.0.1:5000/course/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course_title: selectedCourse.course_title,
            username: username,
          }),
        });
        if (response.ok) {
          await fetchDashboardData(token);
          setSelectedCourse(null);
        }
      } catch (err) {
        console.error("Complete course error:", err);
      }
    }
  };

  const handleToolClick = (route: string) => {
    router.push(route);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    router.push("/student-login");
  };

  const sortedCourses = courses.sort((a, b) => a.module_name.localeCompare(b.module_name));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <motion.div
        className="w-64 bg-[#1f2937] text-white p-6 flex flex-col"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-8">
          <Button
            variant="ghost"
            className="w-24 h-24 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center mb-4"
            onClick={handleProfileClick}
          >
            <Brain className="w-16 h-16 text-[#1f2937]" />
          </Button>
          <h2 className="text-amber-500 text-xl font-semibold">{username || "Student"}</h2>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveSection(item.name.toLowerCase())}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeSection === item.name.toLowerCase()
                      ? "bg-amber-500 text-orange"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </motion.div>

      <div className="flex-1 p-8 relative">
        {sessions.length > 0 && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setShowSessionPopup(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white relative"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {sessions.length}
              </span>
            </Button>
          </div>
        )}
        {showSessionPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Scheduled Sessions</h3>
                <Button
                  onClick={() => setShowSessionPopup(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {sessions.map((session, index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="font-semibold text-gray-800">{session.session_title}</p>
                    <p className="text-sm text-gray-600">Date: {session.session_date}</p>
                    <p className="text-sm text-gray-600">Type: {session.session_type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {activeSection === "dashboard" && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {username || "Student"}!</h1>
                <div className="w-48 h-1 bg-amber-500 mt-2"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                  <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Tests Taken</h3>
                      <p className="text-4xl font-bold text-indigo-600">{testsTaken}</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Highest Score</h3>
                      <p className="text-4xl font-bold text-indigo-600">{highestScore.toFixed(2)}%</p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <Card className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Active Time</h3>
                      <p className="text-4xl font-bold text-indigo-600">45h</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tests Taken by Name</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="test_name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip wrapperClassName="bg-white shadow-md rounded-md" />
                        <Bar dataKey="tests" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Highest Scores by Test</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="test_name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip wrapperClassName="bg-white shadow-md rounded-md" />
                        <Bar dataKey="highest_score" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {activeSection === "assessment" && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Assessments</h2>
              {!currentAssessment ? (
                <div className="space-y-4">
                  {assessments.map((assessment, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow bg-white">
                      <CardContent className="p-6 flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{assessment.title}</h3>
                          <p className="text-gray-600">{assessment.questions.length} questions</p>
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
                  {currentAssessment.questions.map((q, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-lg">{q.question}</Label>
                      <RadioGroup
                        value={answers[`question-${index}`] || ""}
                        onValueChange={(value) => handleAnswerChange(`question-${index}`, value)}
                      >
                        {q.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`option-${index}-${optIndex}`} />
                            <Label htmlFor={`option-${index}-${optIndex}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
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
              {selectedCourse ? (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{selectedCourse.course_title}</h3>
                    <Button
                      onClick={() => setSelectedCourse(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      Back to Courses
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Module: {selectedCourse.module_name}</p>
                  <div className="space-y-6">
                    {Array.isArray(selectedCourse.course_content) ? (
                      selectedCourse.course_content.map((section, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4">
                          <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                            {typeof section === "object" ? section.title : "Section " + (index + 1)}
                          </h4>
                          <pre className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                            {typeof section === "object" ? section.content : section}
                          </pre>
                        </div>
                      ))
                    ) : (
                      <pre className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                        {selectedCourse.course_content}
                      </pre>
                    )}
                  </div>
                  <Button
                    onClick={completeCourse}
                    className="mt-6 bg-green-500 hover:bg-green-600 text-white w-full"
                  >
                    Finish Course
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCourses.map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full bg-gradient-to-br from-orange-500 to-amber-600 text-white border-none">
                        <CardContent className="p-6 relative">
                          <div className="absolute top-2 right-2">
                            {course.completed_by.includes(username || "") && (
                              <CheckCircle className="w-6 h-6 text-green-400" />
                            )}
                          </div>
                          <Brain className="w-12 h-12 mb-4" />
                          <h3 className="text-xl font-bold mb-2">{course.course_title}</h3>
                          <p className="text-sm opacity-80 mb-4">Module: {course.module_name}</p>
                          <Button
                            onClick={() => handleCourseClick(course)}
                            className="w-full bg-white text-indigo-600 hover:bg-indigo-100 transition-colors"
                          >
                            {course.course_content ? "Start Course" : "Go to Course"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "tools" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Tools</h2>
                <div className="w-48 h-1 bg-amber-500"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolItems.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-6 relative z-10">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full shadow-md">
                            <tool.icon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">{tool.name}</h3>
                        <p className="text-sm text-gray-500 text-center mb-4">
                          {tool.name === "Mock Interviews" && "Practice your interview skills"}
                          {tool.name === "Resume ATS Score" && "Optimize your resume for ATS"}
                          {tool.name === "Model Prediction" && "Predict your career path"}
                          {tool.name === "Resume Creation" && "Build a professional resume"}
                        </p>
                        <Button
                          onClick={() => handleToolClick(tool.route)}
                          className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 transition-all duration-300 rounded-full py-2 shadow-md"
                        >
                          Launch Tool
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}