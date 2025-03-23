"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) console.error("Gemini API key is not defined in .env file");

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

export default function Interview() {
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "expert">("medium");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcriptResult = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(transcriptResult);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    } else {
      console.error("SpeechRecognition not supported.");
    }

    if (isSubmitted && containerRef.current) {
      containerRef.current.requestFullscreen();
      document.addEventListener("fullscreenchange", handleFullScreenChange);
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, [isSubmitted]);

  const handleFullScreenChange = () => {
    if (!document.fullscreenElement && isSubmitted) {
      alert("You have exited full-screen mode. The interview will stop, and you will be redirected to the dashboard.");
      setIsSubmitted(false);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
      router.push("/interviews");
    }
  };

  useEffect(() => {
    if (isSubmitted && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing media devices:", err));
    }
  }, [isSubmitted]);

  const speakQuestion = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = () => {
      const responsePrompt = new SpeechSynthesisUtterance("Who would you like to give this interview to?");
      window.speechSynthesis.speak(responsePrompt);
    };
    window.speechSynthesis.speak(utterance);
  };

  const generateQuestionsWithGemini = async () => {
    if (!model) {
      return ["Tell us about yourself.", "What’s your experience?", "Describe a project.", "How do you debug?", "What’s your strength?"];
    }

    const prompt = `
      Generate 5 logical and relevant interview questions for a ${jobRole} with a tech stack of ${jobDescription} and ${yearsExperience} years of experience. 
      The difficulty level should be ${difficulty}. Questions should be concise, encourage technical responses, and match the experience level.
      Return as a numbered list (e.g., 1. Question...).
    `;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const generatedQuestions = responseText
        .split("\n")
        .filter((line) => line.trim() && !isNaN(parseInt(line.charAt(0))))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim());
      return generatedQuestions.slice(0, 5);
    } catch (error) {
      console.error("Error generating questions:", error);
      return ["Tell us about yourself.", "What’s your experience?", "Describe a project.", "How do you debug?", "What’s your strength?"];
    }
  };

  interface Evaluation {
    feedback: string;
    rating: number;
  }

  const evaluateResponseWithDeepSeek = async (question: string, response: string): Promise<Evaluation> => {
    try {
      const res = await fetch("/interview/evaluate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          response,
          job_role: jobRole,
          years_of_experience: yearsExperience,
          hardness: difficulty,
        }),
      });

      if (!res.ok) {
        const errorResponse = await res.text();
        console.error("Server responded with:", errorResponse);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      return data.evaluation;
    } catch (error) {
      console.error("Error evaluating response:", error);
      return { feedback: "Error evaluating response", rating: 0 };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (jobRole && jobDescription && yearsExperience) {
      setIsSubmitted(true);
      const generatedQuestions = await generateQuestionsWithGemini();
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      speakQuestion(generatedQuestions[0]);
    } else {
      alert("Please fill all fields!");
    }
  };

  const handleRecord = () => {
    if (recognitionRef.current && !isRecording) {
      window.speechSynthesis.cancel();
      setIsRecording(true);
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const handleStop = async () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      const updatedResponses = [...responses, transcript.trim()];
      setResponses(updatedResponses);

      const evaluation = await evaluateResponseWithDeepSeek(questions[currentQuestionIndex], transcript.trim());
      setFeedback((prev) => [...prev, evaluation.feedback]);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        speakQuestion(questions[currentQuestionIndex + 1]);
        setTranscript("");
      }
    }
  };

  const handleFinalSubmit = async () => {
    const totalScore = feedback.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    setScore(totalScore);

    await fetch("/api/saveInterview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobRole, jobDescription, yearsExperience, questions, responses, feedback, score: totalScore }),
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#1f2937] flex items-center justify-center p-6">
      {!isSubmitted ? (
        <div className="bg-white shadow-2xl rounded-xl p-10 max-w-lg w-full transform transition-all hover:scale-105">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Prepare for Your Interview</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-800 font-semibold mb-2">Job Role</label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-500 transition"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-800 font-semibold mb-2">Tech Stack</label>
              <input
                type="text"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g., React, Node.js"
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-500 transition"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-800 font-semibold mb-2">Years of Experience</label>
              <input
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g., 3"
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-500 transition"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-800 font-semibold mb-2">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard" | "expert")}
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-orange-500 transition"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
            >
              Start Interview
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-2xl rounded-xl p-10 w-full h-screen flex flex-col">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Interview: {jobRole}</h1>
          <div className="grid grid-cols-2 gap-8 flex-1">
            <div className="flex flex-col">
              <video ref={videoRef} autoPlay className="w-full h-80 rounded-lg shadow-lg border-4 border-gray-300" />
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleRecord}
                  disabled={isRecording}
                  className={`flex-1 py-3 rounded-lg text-white font-semibold transition ${isRecording ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"}`}
                >
                  {isRecording ? "Recording..." : "Start Recording"}
                </button>
                <button
                  onClick={handleStop}
                  disabled={!isRecording}
                  className={`flex-1 py-3 rounded-lg text-white font-semibold transition ${!isRecording ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
                >
                  Stop
                </button>
              </div>
              {transcript && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-800">Live Transcript:</h3>
                  <p className="text-gray-700">{transcript}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              {currentQuestionIndex < questions.length ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Question {currentQuestionIndex + 1} / {questions.length}
                  </h3>
                  <p className="text-lg text-gray-700 bg-gray-100 p-4 rounded-lg shadow-sm">
                    {questions[currentQuestionIndex]}
                  </p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-orange-600 h-2.5 rounded-full"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">All Questions Answered!</h3>
                    {feedback.length > 0 && score !== null ? (
                      <div className="space-y-6">
                        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
                          <h4 className="text-xl font-semibold text-gray-800 mb-4">Feedback</h4>
                          <ul className="space-y-3 text-gray-700">
                            {feedback.map((fb, index) => (
                              <li key={index} className="p-3 bg-white rounded-lg shadow-sm">{fb}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-lg text-white">
                          <h4 className="text-xl font-semibold">Your Score</h4>
                          <p className="text-4xl font-bold mt-2">{score}/{responses.length * 2}</p>
                          <p className="mt-4">
                            {score < responses.length
                              ? "Focus on technical depth and clarity."
                              : score < responses.length * 1.5
                              ? "Good effort! Add more specific examples."
                              : "Outstanding! Keep refining your answers."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">Click Submit to get feedback...</p>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-6">
                {currentQuestionIndex < questions.length && feedback.length === 0 && (
                  <button
                    onClick={handleFinalSubmit}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
                  >
                    Submit
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    document.exitFullscreen();
                    router.push("/interview");
                  }}
                  className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition font-semibold mt-4"
                >
                  Back to Interviews Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}