"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function StudentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [loginToken, setLoginToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        setLoginToken(data.token);
        setEmail(data.email);
        console.log("Login successful, token:", data.token);
        setShowOtp(true);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const otpValue = otp.join("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify_login_otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
        body: JSON.stringify({ otp: otpValue }),
      });

      const data = await response.json();
      console.log("OTP verification response:", data);

      if (response.ok) {
        localStorage.setItem("jwtToken", data.token);
        console.log("OTP verified, token saved:", data.token);
        console.log("Token in localStorage:", localStorage.getItem("jwtToken"));

        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/get`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
        const profileData = await profileResponse.json();
        console.log("Profile response:", profileData);

        if (profileResponse.ok && profileData.exists) {
          console.log("Profile exists, redirecting to dashboard");
          router.push("/student-dashboard");
        } else {
          console.log("Profile does not exist, redirecting to profile");
          router.push("/student-profile");
        }
      } else {
        setError("Invalid OTP. Please try again.");
        console.log("OTP verification failed:", data);
      }
    } catch (error) {
      setError("An error occurred during OTP verification or profile fetch.");
      console.error("Error in OTP/profile process:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1f2937] flex items-center justify-center p-4">
      {/* Main Content */}
      <motion.div
        className={`max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-[#FFD700] transition-all duration-300 ${
          loading ? "blur-sm" : ""
        }`}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[#1f2937]">
          {showOtp ? "Enter OTP" : "Student Login"}
        </h1>

        {!showOtp ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-gray-700 font-semibold text-lg">
                Username
              </label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={loading}
                className="w-full border-[#f59e0b] focus:border-[#FFD700] p-2 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-gray-700 font-semibold text-lg">
                Password
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full border-[#f59e0b] focus:border-[#FFD700] p-2 rounded-md"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <motion.div whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}>
              <Button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-[#f59e0b] to-[#FFD700] hover:from-[#FFD700] hover:to-[#f59e0b] text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </motion.div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="text-center text-gray-600 mb-4">
              You got an OTP for the email: <span className="font-semibold text-[#f59e0b]">{email}</span>
            </div>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  disabled={loading}
                  className={`w-12 h-12 text-center text-xl font-bold border-2 border-[#f59e0b] rounded-md focus:border-[#FFD700] focus:outline-none bg-gray-50 shadow-inner ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <motion.div whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}>
              <Button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-[#f59e0b] to-[#FFD700] hover:from-[#FFD700] hover:to-[#f59e0b] text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </motion.div>
          </form>
        )}

        {!showOtp && (
          <>
            <div className="mt-6 text-center">
              <Link href="/forgot-password" className="text-[#f59e0b] hover:text-[#FFD700] font-medium">
                Forgot your password?
              </Link>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600">Do not have an account?</p>
              <Link href="/student-signup" className="text-[#f59e0b] hover:text-[#FFD700] font-bold">
                Sign up now
              </Link>
            </div>
            <div className="mt-4 text-center">
              <Link href="/chosen" className="text-gray-600 hover:text-[#f59e0b]">
                &larr; Back to login selection
              </Link>
            </div>
          </>
        )}
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
            <p className="text-white text-lg mt-4 font-semibold">
              {showOtp ? "CareerVision Verifying..." : "CareerVision Loading..."}
            </p>
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