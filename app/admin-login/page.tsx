"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading to true when the request starts

    const startTime = Date.now(); // Record the start time of the request

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token); // Store admin JWT token
        router.push("/admin-dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error("Login error:", err);
    } finally {
      // Calculate the elapsed time
      const elapsedTime = Date.now() - startTime;
      const minimumLoadingTime = 1000; // Minimum 1 second for the loading animation

      // Ensure the loading animation runs for at least the minimum time
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
      setTimeout(() => {
        setLoading(false); // Set loading to false after the minimum time
      }, remainingTime);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1f2937] flex items-center justify-center p-4">
      {/* Main Content */}
      <motion.div
        className={`max-w-md w-full bg-white p-8 rounded-lg shadow-xl transition-all duration-300 ${
          loading ? "blur-sm" : ""
        }`}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
              Username
            </label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin username"
              required
              disabled={loading} // Disable input during loading
              className="w-full border-[#f59e0b] focus:border-[#FFD700] p-2 rounded-md"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading} // Disable input during loading
              className="w-full border-[#f59e0b] focus:border-[#FFD700] p-2 rounded-md"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <motion.div whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}>
            <Button
              type="submit"
              disabled={loading} // Disable button during loading
              className={`w-full bg-gradient-to-r from-[#f59e0b] to-[#FFD700] hover:from-[#FFD700] hover:to-[#f59e0b] text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </motion.div>
        </form>
        <div className="mt-4 text-center">
          <Link href="/chosen" className="text-gray-600 hover:text-[#f59e0b]">
            ← Back to login selection
          </Link>
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
            <p className="text-white text-lg mt-4 font-semibold">CareerVision Loading...</p>
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

        /* Subtle pulse effect around the spinner */
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