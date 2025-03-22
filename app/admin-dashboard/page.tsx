"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
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
  LogOut,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Assessment {
  title: string;
  question_count: number;
}

interface Session {
  id: string;
  session_title: string;
  session_date: string;
  session_type: string;
}

interface Course {
  id: string;
  moduleName: string;
  courseTitle: string;
  courseLink?: string;
  fileName?: string;
}

interface GraphData {
  test_name?: string;
  tests?: number;
  username?: string;
}

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Manage Questions", icon: FileQuestion, active: false },
  { name: "Courses", icon: GraduationCap, active: false },
  { name: "Scheduling Calendar", icon: Calendar, active: false },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [assessmentFile, setAssessmentFile] = useState<File | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [testsTaken, setTestsTaken] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [testsPerAssessment, setTestsPerAssessment] = useState<GraphData[]>([]);
  const [studentActivity, setStudentActivity] = useState<GraphData[]>([]);

  const [moduleName, setModuleName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseLink, setCourseLink] = useState("");
  const [courseFile, setCourseFile] = useState<File | null>(null);

  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionType, setSessionType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin-login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/admin/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setTestsTaken(data.tests_taken);
          setTotalStudents(data.total_students);
          setActiveStudents(data.active_students);
          setTotalAssessments(data.total_assessments);
          setTestsPerAssessment(data.tests_per_assessment || []);
          setStudentActivity(data.student_activity || []);
        }
      } catch (err) {
        console.error("Fetch dashboard data error:", err);
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
          setAssessments(data.assessments.map((a: any) => ({
            title: a.title,
            question_count: a.questions.length,
          })));
        }
      } catch (err) {
        console.error("Fetch assessments error:", err);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/admin/courses", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setCourses(data.courses.map((c: any) => ({
            id: c.course_id || Math.random().toString(36).substr(2, 9),
            moduleName: c.module_name,
            courseTitle: c.course_title,
            courseLink: c.course_link,
            fileName: c.course_content ? "Uploaded PDF" : undefined,
          })));
        }
      } catch (err) {
        console.error("Fetch courses error:", err);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/admin/sessions", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setSessions(data.sessions.map((s: any) => ({
            id: s.session_id || Math.random().toString(36).substr(2, 9),
            session_title: s.session_title,
            session_date: s.session_date,
            session_type: s.session_type,
          })));
        }
      } catch (err) {
        console.error("Fetch sessions error:", err);
      }
    };

    fetchDashboardData();
    fetchAssessments();
    fetchCourses();
    fetchSessions();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAssessmentFile(e.target.files[0]);
    }
  };

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!assessmentTitle || !assessmentFile || !token) {
      alert("Please provide a title, PDF file, and ensure you're logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("title", assessmentTitle);
    formData.append("pdf_file", assessmentFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/admin/upload-assessment", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setAssessments((prev) => [...prev, { title: data.title, question_count: data.question_count }]);
        setAssessmentTitle("");
        setAssessmentFile(null);
        alert("Assessment uploaded successfully!");
        const dashboardResponse = await fetch("http://127.0.0.1:5000/admin/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const dashboardData = await dashboardResponse.json();
        if (dashboardResponse.ok) {
          setTestsTaken(dashboardData.tests_taken);
          setTotalStudents(dashboardData.total_students);
          setActiveStudents(dashboardData.active_students);
          setTotalAssessments(dashboardData.total_assessments);
          setTestsPerAssessment(dashboardData.tests_per_assessment || []);
          setStudentActivity(dashboardData.student_activity || []);
        }
      } else {
        alert(data.message || "Failed to upload assessment.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred while uploading.");
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!moduleName || !courseTitle || !token) {
      alert("Please provide Module Name, Course Title, and ensure you're logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("module_name", moduleName);
    formData.append("course_title", courseTitle);
    if (courseLink) formData.append("course_link", courseLink);
    if (courseFile) formData.append("course_material", courseFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/admin/upload-course", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setCourses((prev) => [...prev, {
          id: data.course_id || Math.random().toString(36).substr(2, 9),
          moduleName,
          courseTitle,
          courseLink,
          fileName: courseFile ? courseFile.name : undefined,
        }]);
        setModuleName("");
        setCourseTitle("");
        setCourseLink("");
        setCourseFile(null);
        alert("Course uploaded successfully!");
      } else {
        alert(data.message || "Failed to upload course.");
      }
    } catch (err) {
      console.error("Upload course error:", err);
      alert("An error occurred while uploading course.");
    }
  };

  const handleSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!sessionTitle || !sessionDate || !sessionType || !token) {
      alert("Please provide Session Title, Date, Type, and ensure you're logged in.");
      return;
    }

    const sessionData = {
      sessionTitle,  // Fixed: Use camelCase to match state variable
      session_date: sessionDate,  // Expected as "dd-mm-yyyy"
      sessionType,   // Fixed: Use camelCase to match state variable
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/admin/schedule-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });
      const data = await response.json();
      if (response.ok) {
        setSessions((prev) => [...prev, {
          id: data.session_id || Math.random().toString(36).substr(2, 9),
          session_title: sessionTitle,  // Match backend field name
          session_date: sessionDate,
          session_type: sessionType,    // Match backend field name
        }]);
        setSessionTitle("");
        setSessionDate("");
        setSessionType("");
        alert("Session scheduled successfully!");
      } else {
        alert(data.message || "Failed to schedule session.");
      }
    } catch (err) {
      console.error("Schedule session error:", err);
      alert("An error occurred while scheduling session.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin-login");
  };

  return (
    <div className="flex min-h-screen">
      <motion.div
        className="w-64 bg-[#1f2937] text-white flex flex-col"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <h2 className="text-amber-500 text-2xl font-bold mb-6">Admin Panel</h2>
        </div>
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
        <Button
          onClick={handleLogout}
          className="m-6 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </motion.div>

      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {activeSection === "dashboard" && (
            <>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                  <Card className="bg-amber-500 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">Tests Taken</h3>
                          <p className="text-4xl font-bold text-white">{testsTaken}</p>
                        </div>
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Total Students</h3>
                          <p className="text-4xl font-bold text-gray-600">{totalStudents}</p>
                        </div>
                        <Users className="w-8 h-8 text-amber-500" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Active Students</h3>
                          <p className="text-4xl font-bold text-gray-600">{activeStudents}</p>
                        </div>
                        <Clock className="w-8 h-8 text-amber-500" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Total Assessments</h3>
                          <p className="text-4xl font-bold text-gray-600">{totalAssessments}</p>
                        </div>
                        <FileQuestion className="w-8 h-8 text-amber-500" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tests Taken per Assessment</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={testsPerAssessment}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="test_name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Bar dataKey="tests" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Student Activity (Tests per Student)</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={studentActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="username" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Bar dataKey="tests" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
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
                  <Input
                    id="assessmentFile"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    required
                  />
                </div>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Assessment
                </Button>
              </form>
              {assessments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Uploaded Assessments</h3>
                  <div className="space-y-4">
                    {assessments.map((assessment, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <p className="font-semibold">{assessment.title}</p>
                          <p className="text-sm text-gray-600">{assessment.question_count} questions</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
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
                      <Label htmlFor="courseFile">Upload Course Material (PDF, Optional)</Label>
                      <Input
                        id="courseFile"
                        type="file"
                        onChange={(e) => e.target.files && setCourseFile(e.target.files[0])}
                        accept=".pdf"
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
                              {course.courseLink && <p className="text-sm text-gray-500">Link: {course.courseLink}</p>}
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
                        <Label htmlFor="sessionDate">Date (dd-mm-yyyy)</Label>
                        <Input
                          id="sessionDate"
                          type="text"
                          value={sessionDate}
                          onChange={(e) => setSessionDate(e.target.value)}
                          placeholder="dd-mm-yyyy"
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
              {sessions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Sessions</h3>
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <Card key={session.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-bold">{session.session_title}</h4>
                              <p className="text-sm text-gray-600">
                                {session.session_date} - {session.session_type}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}