"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ChosenPage() {
  const router = useRouter();
  const [selectedLogin, setSelectedLogin] = useState<string>("");
  const [loading, setLoading] = useState(false); 
  const [loadingMessage, setLoadingMessage] = useState(""); 

  const handleLogin = () => {
    if (!selectedLogin) return; 

    setLoading(true); 
    setLoadingMessage("Navigating to Login..."); 
    const startTime = Date.now(); // Record the start time

    // Navigate based on the selected login type
    if (selectedLogin === "student") {
      router.push("/student-login");
    } else if (selectedLogin === "admin") {
      router.push("/admin-login");
    }

    // Calculate the elapsed time after navigation
    const elapsedTime = Date.now() - startTime;

    // Ensure the loading animation runs for at least the minimum time
    const minimumLoadingTime = 1000; // Minimum 1 second for the loading animation
    const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

    setTimeout(() => {
      setLoading(false); // Set loading to false after the minimum time
    }, remainingTime);
  };

  return (
    <div className="min-h-screen bg-[#1f2937] flex flex-col items-center justify-center p-4">
      {/* Logo and Title */}
      <motion.div
        className={`text-center mb-8 transition-all duration-300 ${loading ? "blur-sm" : ""}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-white">Career</span>
          <span className="text-amber-500">VISION</span>
        </h1>
        <p className="text-amber-500 text-2xl font-script">
          Your Vision, Your Career, Your Future
        </p>
      </motion.div>

      {/* Login Selection Card */}
      <motion.div
        className={`bg-white rounded-lg shadow-xl p-8 max-w-md w-full transition-all duration-300 ${
          loading ? "blur-sm" : ""
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-center text-amber-500 mb-6">
          Select Login Type
        </h2>

        <div className="space-y-6">
          <Select onValueChange={setSelectedLogin} disabled={loading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose login type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student Login</SelectItem>
              <SelectItem value="admin">Admin Login</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleLogin}
            className={`w-full bg-amber-500 hover:bg-amber-600 text-white ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!selectedLogin || loading}
          >
            {loading ? "Loading..." : "Go to Login"}
          </Button>
        </div>
      </motion.div>

      {/* Full-Screen Loading Overlay */}
      {loading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-[#1f2937] bg-opacity-80 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="career-vision-spinner">
              <div className="spinner-circle"></div>
            </div>
            <p className="text-white text-lg mt-4 font-semibold">{loadingMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Inline CSS for the CareerVision Spinner */}
      <style jsx>{`
        .career-vision-spinner {
          position: relative;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner-circle {
          width: 50px;
          height: 50px;
          border: 5px solid transparent;
          border-top: 5px solid #f59e0b;
          border-right: 5px solid #ffd700;
          border-radius: 50%;
          animation: spin 1s linear infinite, glow 1.5s ease-in-out infinite;
          position: absolute;
        }

        .career-vision-spinner::before {
          content: '';
          position: absolute;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.3), transparent);
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 8px #f59e0b, 0 0 15px #ffd700;
          }
          50% {
            box-shadow: 0 0 15px #f59e0b, 0 0 25px #ffd700;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}