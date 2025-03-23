"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  const startAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setAnswers({});
    setScore(null);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setAnswers((prev: Record<string, string>) => ({ ...prev, [questionId]: answer }));

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
    }
  };

  return (
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
  );}
}