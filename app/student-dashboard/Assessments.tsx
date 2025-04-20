"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Confetti from "react-confetti";
import { X } from "lucide-react";

interface Assessment {
  title: string;
  questions: { question: string; options: string[]; correct_answer: string | null }[];
}

interface AssessmentsProps {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
  score: number | null;
  setScore: (score: number | null) => void;
  username: string | null;
  fetchDashboardData: (token: string) => Promise<void>;
}

export default function Assessments({
  assessments,
  currentAssessment,
  setCurrentAssessment,
  answers,
  setAnswers,
  score,
  setScore,
  username,
  fetchDashboardData,
}: AssessmentsProps) {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [showResults, setShowResults] = useState(false);
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);

  // Timer logic
  useEffect(() => {
    if (!currentAssessment || showResults || !isAssessmentActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          submitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentAssessment, showResults, isAssessmentActive]);

  // Handle full-screen mode and Escape key
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && isAssessmentActive) {
        submitAssessment();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isAssessmentActive) {
        event.preventDefault();
        submitAssessment();
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAssessmentActive]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const startAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setAnswers({}); // Reset answers
    setScore(null);
    setTimeLeft(5 * 60);
    setShowResults(false);
    setIsAssessmentActive(true);

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    // Ensure answers is always an object before updating
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitAssessment = async () => {
    if (!currentAssessment) return;

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
    setShowResults(true);
    setIsAssessmentActive(false);

    const assessmentData = {
      username,
      assessment_id: currentAssessment.title,
      score: calculatedScore,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(assessmentData),
      });
      if (response.ok && token) {
        await fetchDashboardData(token);
      }
    } catch (err) {
      console.error("Submit assessment error:", err);
    }

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const closeAssessment = () => {
    if (isAssessmentActive) {
      submitAssessment();
    }
  };

  const closeResults = () => {
    setShowResults(false);
    setCurrentAssessment(null);
  };

  return (
    <div className="relative">
      {/* Assessment List */}
      {!currentAssessment || !isAssessmentActive ? (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Assessments</h2>
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
        </div>
      ) : null}

      {/* Full-Screen Assessment */}
      {currentAssessment && isAssessmentActive && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col z-50">
          <div className="bg-white shadow-lg p-6 flex justify-between items-center">
            <h3 className="text-3xl font-bold text-gray-800">{currentAssessment.title}</h3>
            <div className="flex items-center space-x-4">
              <div className="text-xl font-semibold text-red-600">
                Time Left: {formatTime(timeLeft)}
              </div>
              <Button
                onClick={closeAssessment}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                title="Closing the assessment will submit your answers"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            {currentAssessment.questions.map((q, index) => (
              <div
                key={index}
                className="mb-8 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Label className="text-xl font-semibold text-gray-800 mb-4 block">
                  {index + 1}. {q.question}
                </Label>
                <RadioGroup
                  value={answers[`question-${index}`] || ""}
                  onValueChange={(value) => handleAnswerChange(`question-${index}`, value)}
                  className="space-y-3"
                >
                  {q.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`flex items-center p-4 rounded-lg border transition-all duration-200 cursor-pointer
                        ${answers[`question-${index}`] === option ? "bg-amber-100 border-amber-500" : "bg-gray-50 border-gray-200"}
                        hover:bg-amber-50 hover:border-amber-300`}
                    >
                      <RadioGroupItem
                        value={option}
                        id={`option-${index}-${optIndex}`}
                        className="w-5 h-5 text-amber-500"
                      />
                      <Label
                        htmlFor={`option-${index}-${optIndex}`}
                        className="ml-3 text-lg text-gray-700 cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <div className="p-6 flex justify-end">
            <Button
              onClick={submitAssessment}
              className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-3 rounded-full shadow-md"
            >
              Submit Assessment
            </Button>
          </div>
        </div>
      )}

      {/* Results Popup */}
      {showResults && score !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative overflow-hidden">
            <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Assessment Completed!</h3>
            <p className="text-lg font-semibold text-green-800 text-center mb-6">
              Your Score: {score.toFixed(2)}%
            </p>
            <div className="flex justify-center">
              <Button onClick={closeResults} className="bg-amber-500 hover:bg-amber-600">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}