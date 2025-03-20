"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  });
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFirstSave, setIsFirstSave] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Please log in to access your profile.");
      router.push("/student-login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/profile/get", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok && data.exists) {
          setFormData({
            college_name: data.profile.college_name || "",
            resume: null, // Files can't be preloaded
            interests: data.profile.interests || [],
            skills: data.profile.skills || [],
            achievements: data.profile.achievements || [],
            profile_photo: null, // Files can't be preloaded
            certificate_names: data.profile.certificates.map((c: any) => c.name) || [],
            certificates: [], // Files can't be preloaded
          });
        } else {
          setIsFirstSave(true); // No profile exists, this is the first save
        }
      } catch (err) {
        setError("Failed to load profile. Please try again.");
        console.error("Fetch profile error:", err);
      }
    };

    fetchProfile();
  }, [router]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const value = e.target.value;
    if (field === "interests" || field === "skills" || field === "achievements" || field === "certificate_names") {
      setFormData((prev) => ({ ...prev, [field]: value.split(",").map((item) => item.trim()) }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (files) {
      if (field === "certificates") {
        setFormData((prev) => ({ ...prev, certificates: Array.from(files) }));
      } else if (field === "profile_photo") {
        setFormData((prev) => ({ ...prev, profile_photo: files[0] }));
        setProfileImagePreview(URL.createObjectURL(files[0]));
      } else {
        setFormData((prev) => ({ ...prev, [field]: files[0] }));
      }
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Please log in to save your profile.");
      setIsSaving(false);
      router.push("/student-login");
      return;
    }

    const data = new FormData();
    data.append("college_name", formData.college_name);
    if (formData.resume) data.append("resume", formData.resume);
    formData.interests.forEach((interest) => data.append("interests[]", interest));
    formData.skills.forEach((skill) => data.append("skills[]", skill));
    formData.achievements.forEach((ach) => data.append("achievements[]", ach));
    if (formData.profile_photo) data.append("profile_photo", formData.profile_photo);
    formData.certificate_names.forEach((name) => data.append("certificate_names[]", name));
    formData.certificates.forEach((cert) => data.append("certificates[]", cert));

    try {
      const response = await fetch("http://127.0.0.1:5000/profile/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess("Profile saved successfully!");
        if (isFirstSave) {
          setTimeout(() => {
            setSuccess("");
            router.push("/career-choice");
          }, 1500);
        } else {
          setTimeout(() => setSuccess(""), 3000);
        }
      } else {
        setError(result.message || "Failed to save profile.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Save profile error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <img
                  src={profileImagePreview || "/placeholder.svg?height=128&width=128"}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md transition-transform group-hover:scale-105"
                />
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "profile_photo")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all">
                  <Upload className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">Student Profile</h1>
                <p className="text-sm opacity-80 mt-1">View and update your professional details</p>
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-white text-indigo-600 hover:bg-indigo-100 font-semibold py-2 px-4 rounded-full shadow-md transition-colors"
              >
                {isSaving ? "Saving..." : <><Save className="h-5 w-5 mr-2" /> Save Profile</>}
              </Button>
            </div>
          </CardHeader>
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
            <div className="space-y-6">
              <div>
                <Label htmlFor="college_name" className="text-lg font-medium text-gray-700">College Name</Label>
                <Input
                  id="college_name"
                  value={formData.college_name}
                  onChange={(e) => handleTextChange(e, "college_name")}
                  className="mt-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  placeholder="Enter your college name"
                />
              </div>
              <Separator className="my-4" />
              <div>
                <Label htmlFor="resume" className="text-lg font-medium text-gray-700">Resume (PDF)</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "resume")}
                  className="mt-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                />
                {formData.resume && <p className="mt-2 text-sm text-gray-600">Selected: {formData.resume.name}</p>}
              </div>
              <Separator className="my-4" />
              <div>
                <Label htmlFor="interests" className="text-lg font-medium text-gray-700">Interests</Label>
                <Textarea
                  id="interests"
                  value={formData.interests.join(", ")}
                  onChange={(e) => handleTextChange(e, "interests")}
                  className="mt-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  placeholder="Enter interests separated by commas (e.g., coding, reading)"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.interests.map((item, idx) => (
                    <Badge key={idx} className="bg-indigo-100 text-indigo-800">{item}</Badge>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <Label htmlFor="skills" className="text-lg font-medium text-gray-700">Skills</Label>
                <Textarea
                  id="skills"
                  value={formData.skills.join(", ")}
                  onChange={(e) => handleTextChange(e, "skills")}
                  className="mt-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  placeholder="Enter skills separated by commas (e.g., Python, SQL)"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map((item, idx) => (
                    <Badge key={idx} className="bg-indigo-100 text-indigo-800">{item}</Badge>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <Label htmlFor="achievements" className="text-lg font-medium text-gray-700">Achievements</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements.join(", ")}
                  onChange={(e) => handleTextChange(e, "achievements")}
                  className="mt-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  placeholder="Enter achievements separated by commas (e.g., Won Hackathon)"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.achievements.map((item, idx) => (
                    <Badge key={idx} className="bg-indigo-100 text-indigo-800">{item}</Badge>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <Label htmlFor="certificate_names" className="text-lg font-medium text-gray-700">Certificates</Label>
                <Textarea
                  id="certificate_names"
                  value={formData.certificate_names.join(", ")}
                  onChange={(e) => handleTextChange(e, "certificate_names")}
                  className="mt-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  placeholder="Enter certificate names separated by commas (e.g., Python Cert)"
                />
                <Input
                  id="certificates"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => handleFileChange(e, "certificates")}
                  className="mt-2 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                />
                {formData.certificates.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.certificates.map((cert, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {formData.certificate_names[idx] || "Unnamed"}: {cert.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}