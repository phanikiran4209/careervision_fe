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
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwtToken", data.token);
        console.log("JWT Token:", data.token);

        const profileResponse = await fetch("http://127.0.0.1:5000/profile/get", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
        const profileData = await profileResponse.json();

        if (profileResponse.ok && profileData.exists) {
          router.push("/student-dashboard");
        } else {
          router.push("/student-profile");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#1f2937] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl border border-[#FFD700]"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[#1f2937]">Student Login</h1>
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
              className="w-full border-[#f59e0b] focus:border-[#FFD700] p-2 rounded-md"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#f59e0b] to-[#FFD700] hover:from-[#FFD700] hover:to-[#f59e0b] text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
            >
              Login
            </Button>
          </motion.div>
        </form>
        <div className="mt-6 text-center">
          <Link href="/forgot-password" className="text-[#f59e0b] hover:text-[#FFD700] font-medium">
            Forgot your password?
          </Link>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <Link href="/student-signup" className="text-[#f59e0b] hover:text-[#FFD700] font-bold">
            Sign up now
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link href="/chosen" className="text-gray-600 hover:text-[#f59e0b]">
            ← Back to login selection
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}