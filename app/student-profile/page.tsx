"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, Upload, User, BookOpen, Star, Award, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function StudentProfile() {
  const [formData, setFormData] = useState({
    college_name: "",
    resume: null as File | null,
    interests: [] as string[],
    skills: [] as string[],
    achievements: [] as string[],
    profile_photo: null as File | null,
    certificate_names: [] as string[],
    certificates: [] as File[],
  })
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isFirstSave, setIsFirstSave] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      setError("Please log in to access your profile.")
      router.push("/student-login")
      return
    }

    const fetchProfile = async () => {
      try {
        // Fetch profile data
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/get`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const profileData = await profileResponse.json()

        if (profileResponse.ok && profileData.exists) {
          setFormData({
            college_name: profileData.profile.college_name || "",
            resume: null,
            interests: profileData.profile.interests || [],
            skills: profileData.profile.skills || [],
            achievements: profileData.profile.achievements || [],
            profile_photo: null,
            certificate_names: profileData.profile.certificates.map((c: { name: string }) => c.name) || [],
            certificates: [],
          })
          setIsFirstSave(false)
        } else {
          setIsFirstSave(true)
        }

        // Fetch profile photo in binary format
        const photoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/profile/photo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (photoResponse.ok) {
          // Get the binary data as a blob
          const photoBlob = await photoResponse.blob()
          // Convert the blob to a base64 string
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            setProfileImagePreview(base64String) // Set the base64 data URL for the image
          }
          reader.readAsDataURL(photoBlob)
        } else {
          const photoError = await photoResponse.json()
          console.error("Failed to fetch profile photo:", photoError.message)
          // If the photo fetch fails, keep the preview as null (default user icon will show)
          setProfileImagePreview(null)
        }
      } catch (err) {
        setError("Failed to load profile. Please try again.")
        console.error("Fetch profile error:", err)
      }
    }

    fetchProfile()
  }, [router])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const value = e.target.value
    if (field === "interests" || field === "skills" || field === "achievements" || field === "certificate_names") {
      setFormData((prev) => ({ ...prev, [field]: value.split(",").map((item) => item.trim()) }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files
    if (files) {
      if (field === "certificates") {
        setFormData((prev) => ({ ...prev, certificates: Array.from(files) }))
      } else if (field === "profile_photo") {
        setFormData((prev) => ({ ...prev, profile_photo: files[0] }))
        setProfileImagePreview(URL.createObjectURL(files[0]))
      } else {
        setFormData((prev) => ({ ...prev, [field]: files[0] }))
      }
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    const token = localStorage.getItem("jwtToken")
    if (!token) {
      setError("Please log in to save your profile.")
      setIsSaving(false)
      router.push("/student-login")
      return
    }

    const data = new FormData()
    data.append("college_name", formData.college_name)
    if (formData.resume) data.append("resume", formData.resume)
    formData.interests.forEach((interest) => data.append("interests[]", interest))
    formData.skills.forEach((skill) => data.append("skills[]", skill))
    formData.achievements.forEach((ach) => data.append("achievements[]", ach))
    if (formData.profile_photo) data.append("profile_photo", formData.profile_photo)
    formData.certificate_names.forEach((name) => data.append("certificate_names[]", name))
    formData.certificates.forEach((cert) => data.append("certificates[]", cert))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      })

      const result = await response.json()
      if (response.ok) {
        setSuccess("Profile saved successfully!")
        if (isFirstSave) {
          setTimeout(() => {
            setSuccess("")
            router.push("/career-choice")
          }, 1500)
        } else {
          setTimeout(() => setSuccess(""), 3000)
        }
        // After saving, refetch the profile photo to update the preview
        const photoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/profile/photo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (photoResponse.ok) {
          const photoBlob = await photoResponse.blob()
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            setProfileImagePreview(base64String)
          }
          reader.readAsDataURL(photoBlob)
        }
      } else {
        setError(result.message || "Failed to save profile.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Save profile error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleProfileAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        {/* Header Section */}
        <div
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg shadow-xl p-6 cursor-pointer group relative"
          onClick={handleProfileAreaClick}
        >
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-white shadow-lg transition-transform group-hover:scale-105">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all">
                  <Upload className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Student Profile</h1>
              <p className="text-gray-200 mt-2 text-lg">
                Build your professional identity as a student
              </p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleSaveProfile()
              }}
              disabled={isSaving}
              className="bg-orange-600 text-white hover:bg-orange-700 font-semibold py-2 px-4 rounded-full shadow-md transition-colors"
            >
              {isSaving ? "Saving..." : (
                <>
                  <Save className="h-5 w-5 mr-2" /> Save Profile
                </>
              )}
            </Button>
          </div>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, "profile_photo")}
            className="hidden"
            ref={fileInputRef}
          />
        </div>

        {/* Main Content */}
        <Card className="bg-gray-800 shadow-xl rounded-b-lg border border-gray-700">
          <CardContent className="p-6">
            {success && (
              <Alert className="mb-6 bg-green-100 border-green-500 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="mb-6 bg-red-100 border-red-500 text-red-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* College Name */}
              <motion.div variants={cardVariants}>
                <Card className="bg-white shadow-lg border border-gray-200 transition-transform hover:scale-105 h-full">
                  <CardHeader className="flex items-center space-x-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-gray-800 text-xl font-semibold">College Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="college_name" className="text-gray-700 font-medium">College Name</Label>
                    <Input
                      id="college_name"
                      value={formData.college_name}
                      onChange={(e) => handleTextChange(e, "college_name")}
                      className="mt-2 w-full bg-gray-100 text-gray-800 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                      placeholder="Enter your college name"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resume */}
              <motion.div variants={cardVariants}>
                <Card className="bg-white shadow-lg border border-gray-200 transition-transform hover:scale-105 h-full">
                  <CardHeader className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-gray-800 text-xl font-semibold">Resume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="resume" className="text-gray-700 font-medium">Upload Resume (PDF)</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, "resume")}
                      className="mt-2 w-full bg-gray-100 text-gray-800 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                    />
                    {formData.resume && (
                      <p className="mt-2 text-sm text-gray-600">Selected: {formData.resume.name}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interests */}
              <motion.div variants={cardVariants}>
                <Card className="bg-white shadow-lg border border-gray-200 transition-transform hover:scale-105 h-full">
                  <CardHeader className="flex items-center space-x-3">
                    <Star className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-gray-800 text-xl font-semibold">Interests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="interests" className="text-gray-700 font-medium">Your Interests</Label>
                    <Textarea
                      id="interests"
                      value={formData.interests.join(", ")}
                      onChange={(e) => handleTextChange(e, "interests")}
                      className="mt-2 w-full bg-gray-100 text-gray-800 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                      placeholder="Enter interests separated by commas (e.g., coding, reading)"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.interests.map((item, idx) => (
                        <Badge
                          key={idx}
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skills */}
              <motion.div variants={cardVariants}>
                <Card className="bg-white shadow-lg border border-gray-200 transition-transform hover:scale-105 h-full">
                  <CardHeader className="flex items-center space-x-3">
                    <Award className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-gray-800 text-xl font-semibold">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="skills" className="text-gray-700 font-medium">Your Skills</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills.join(", ")}
                      onChange={(e) => handleTextChange(e, "skills")}
                      className="mt-2 w-full bg-gray-100 text-gray-800 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                      placeholder="Enter skills separated by commas (e.g., Python, SQL)"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.skills.map((item, idx) => (
                        <Badge
                          key={idx}
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements */}
              <motion.div variants={cardVariants}>
                <Card className="bg-white shadow-lg border border-gray-200 transition-transform hover:scale-105 h-full">
                  <CardHeader className="flex items-center space-x-3">
                    <Award className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-gray-800 text-xl font-semibold">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="achievements" className="text-gray-700 font-medium">Your Achievements</Label>
                    <Textarea
                      id="achievements"
                      value={formData.achievements.join(", ")}
                      onChange={(e) => handleTextChange(e, "achievements")}
                      className="mt-2 w-full bg-gray-100 text-gray-800 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                      placeholder="Enter achievements separated by commas (e.g., Won Hackathon)"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.achievements.map((item, idx) => (
                        <Badge
                          key={idx}
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Certificates */}
              <motion.div variants={cardVariants}>
                <Card className="bg-white shadow-lg border border-gray-200 transition-transform hover:scale-105 h-full">
                  <CardHeader className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-gray-800 text-xl font-semibold">Certificates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="certificate_names" className="text-gray-700 font-medium">Certificate Names</Label>
                    <Textarea
                      id="certificate_names"
                      value={formData.certificate_names.join(", ")}
                      onChange={(e) => handleTextChange(e, "certificate_names")}
                      className="mt-2 w-full bg-gray-100 text-gray-800 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                      placeholder="Enter certificate names separated by commas (e.g., Python Cert)"
                    />
                    <Label htmlFor="certificates" className="text-gray-700 font-medium mt-4 block">Upload Certificates (PDF)</Label>
                    <Input
                      id="certificates"
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={(e) => handleFileChange(e, "certificates")}
                      className="mt-2 w-full bg-gray-100 text-gray-800 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                    />
                    {formData.certificates.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {formData.certificates.map((cert, idx) => (
                          <p key={idx} className="text-sm text-gray-600 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-orange-400" />
                            {formData.certificate_names[idx] || "Unnamed"}: {cert.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Back to Dashboard Button */}
            <div className="mt-8 text-center">
              <Button
                onClick={() => router.push("/student-dashboard")}
                className="bg-orange-600 text-white hover:bg-orange-700 font-semibold py-2 px-4 rounded-full shadow-md transition-colors"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}