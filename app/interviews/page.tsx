"use client";

import { useEffect, useState } from "react";

export default function InterviewsDashboard() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch("/api/getInterviews");
        const data = await response.json();
        setInterviews(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#1f2937] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Interviews Dashboard</h1>
        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : interviews.length === 0 ? (
          <p className="text-gray-400 text-center">No interviews completed yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{interview.job_role}</h2>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Tech Stack:</span> {interview.job_description}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Experience:</span> {interview.years_experience} years
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Score:</span> {interview.score || "N/A"}/{interview.responses.length * 2}
                </p>
                <p className="text-gray-500 text-sm">
                  <span className="font-medium">Completed:</span>{" "}
                  {new Date(interview.created_at).toLocaleString()}
                </p>
                <div className="mt-4">
                  <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}