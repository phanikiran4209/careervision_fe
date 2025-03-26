"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowRight, Users, Rocket, Target } from "lucide-react";

export default function GetStartedPage() {
  const router = useRouter();
  const controls = useAnimation();
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
  const [loadingMessage, setLoadingMessage] = useState(""); // Dynamic loading message

  // Handle scroll effect for the navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Animate the main content on mount
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
  }, [controls]);

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleGetStarted = async () => {
    setLoading(true); // Set loading to true when the button is clicked
    setLoadingMessage("APP GETTING STARTED"); // Set the loading message

    try {
      // Perform navigation and wait for it to complete
      await router.push("/chosen");
      // Note: In a real app, router.push doesn't inherently "resolve" when the page loads.
      // The loading state will persist until the next page renders, which is handled by Next.js.
    } catch (error) {
      console.error("Navigation failed:", error);
      setLoading(false); // Reset loading state if navigation fails
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900">
      {/* Navigation Bar */}
      <motion.nav
        className={`py-4 px-6 sticky top-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-gray-900 shadow-lg" : "bg-transparent"
        } ${loading ? "blur-sm" : ""}`}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/" className="text-3xl font-extrabold">
                <span className="text-amber-500">Career</span>
                <span className="text-white">VISION</span>
              </Link>
            </motion.div>
            <div className="hidden md:flex space-x-1">
              {["Home", "About", "Services", "Contact", "Login"].map((item) => (
                <motion.div key={item} variants={itemVariants}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="relative px-3 py-2 text-white font-semibold rounded-full overflow-hidden group hover:text-amber-500 transition-colors duration-300"
                  >
                    <span className="relative z-10">{item}</span>
                    <motion.div
                      className="absolute inset-0 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className={`flex-grow container mx-auto px-4 py-16 transition-all duration-300 ${loading ? "blur-sm" : ""}`}>
        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={controls}>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Shape Your Future with <span className="text-amber-500">CareerVISION</span>
          </motion.h1>
          <motion.p
            className="text-xl mb-12 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Unlock your potential and navigate your career path with confidence
          </motion.p>
          <motion.div
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={loading}
              className={`bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Loading..." : "Get Started"} <ChevronRight className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="mt-24 grid md:grid-cols-3 gap-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { icon: Users, title: "Career Guidance", description: "Expert advice to help you make informed decisions" },
            { icon: Rocket, title: "Skill Development", description: "Enhance your abilities with targeted learning paths" },
            { icon: Target, title: "Job Matching", description: "Find opportunities that align with your aspirations" },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
            >
              <feature.icon className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Call to Action */}
      <motion.div
        className={`bg-amber-500 text-gray-900 py-16 transition-all duration-300 ${loading ? "blur-sm" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8">Join thousands of professionals who have transformed their careers with CareerVISION</p>
          <motion.div whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}>
            <Button
              onClick={handleGetStarted}
              disabled={loading}
              className={`bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Start Your Journey <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className={`bg-gray-900 text-white py-12 transition-all duration-300 ${loading ? "blur-sm" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-amber-500">About CareerVISION</h3>
              <p className="text-gray-400">
                We empower individuals to achieve their professional goals through innovative career development solutions.
              </p>
            </div>
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-amber-500">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-amber-500 transition duration-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-amber-500 transition duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-amber-500 transition duration-300">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-xl font-bold mb-4 text-amber-500">Contact Us</h3>
              <p className="text-gray-400">Email: careervisionvvit@gmail.com</p>
              <p className="text-gray-400">Phone: (+91) 90130-47890</p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-amber-500 transition duration-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition duration-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-500">
            <p>© 2025 CareerVISION. All rights reserved.</p>
          </div>
        </div>
      </footer>

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