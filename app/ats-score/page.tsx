"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { FaUpload, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

interface AnalysisResult {
  "ATS Score": string;
  "Missing Keywords": string;
  "Formatting Suggestions": string;
  "Content Suggestions": string;
}

const ATSScorePage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleJobDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setError(null);
    } else {
      setError("Please upload a valid PDF file.");
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setAnalysisResult(null);

    if (!jobDescription) {
      setError("Please enter a job description.");
      return;
    }

    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", resumeFile);
      formData.append("job_description", jobDescription);

      console.log("Sending request to Flask...");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ats/analyze-resume`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Raw Backend Response:", responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || "Failed to analyze resume");
        } catch (jsonErr) {
          throw new Error("Non-JSON response from backend: " + responseText);
        }
      }

      const result: AnalysisResult = JSON.parse(responseText);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while contacting the backend.");
      console.error("Error in handleSubmit:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#1A2526] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-center text-white mb-4">
          ATS Score Checker
        </h1>
        <p className="text-center text-gray-300 mb-10 max-w-2xl mx-auto">
          Optimize your resume for ATS systems by uploading it and comparing it with a job description. Get a score and actionable insights!
        </p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 p-8 rounded-xl shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-200 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Paste the job description here..."
                rows={6}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-200 mb-2">
                Upload Resume (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white file:bg-orange-500 file:text-white file:font-semibold file:border-0 file:py-2 file:px-4 file:rounded-lg hover:file:bg-orange-600 transition-all"
              />
              {resumeFile && (
                <p className="mt-2 text-sm text-gray-400">
                  Selected: {resumeFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center justify-center mx-auto shadow-md disabled:bg-gray-500"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                "Check My ATS Score"
              )}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-center text-red-400 font-medium">{error}</p>
          )}
        </motion.form>

        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gray-800 p-8 rounded-xl shadow-2xl"
          >
            <h2 className="text-3xl font-semibold text-white text-center mb-6">
              Your ATS Score
            </h2>
            <div className="flex justify-center mb-6">
              <motion.div
                className="relative w-32 h-32 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4B5563"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeDasharray={`${parseInt(analysisResult["ATS Score"])}, 100`}
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-orange-500">
                  {analysisResult["ATS Score"]}
                </span>
              </motion.div>
            </div>
            <p className="text-center text-gray-300 mb-8">
              Your resume matches {analysisResult["ATS Score"]} with the job description.
            </p>

            <h3 className="text-xl font-semibold text-white mb-4">
              Improvement Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Missing Keywords", "Formatting Suggestions", "Content Suggestions"].map(
                (key) => (
                  <motion.div
                    key={key}
                    className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.03 }}
                  >
                    <h4 className="text-lg font-semibold text-orange-500 mb-2">
                      {key}
                    </h4>
                    <p className="text-gray-300">
                      {analysisResult[key as keyof AnalysisResult] || `No suggestions for ${key.toLowerCase()}.`}
                    </p>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ATSScorePage;