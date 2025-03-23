"use client";

import { useState } from "react"; // Import useState for loading state
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function GetStartedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state

  const handleGetStarted = () => {
    setLoading(true); // Set loading to true when the button is clicked
    const startTime = Date.now(); // Record the start time

    // Simulate navigation with router.push
    router.push("/chosen");

    // Calculate a minimum loading time to ensure the animation is visible
    const minimumLoadingTime = 1000; // Minimum 1 second for the loading animation
    const elapsedTime = Date.now() - startTime;

    // Ensure the loading animation runs for at least the minimum time
    const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
    setTimeout(() => {
      setLoading(false); // Set loading to false after the minimum time
    }, remainingTime);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <motion.nav
        className="bg-transparent py-2 px-4 sticky top-0 z-50 transition-all duration-300 backdrop-filter backdrop-blur-sm bg-opacity-30 border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link href="/" className="text-2xl font-extrabold">
                <span className="text-amber-500">Career</span>
                <span className="text-gray-800">VISION</span>
              </Link>
            </motion.div>
            <div className="hidden md:flex space-x-1">
              {["Home", "Contact", "Login"].map((item, index) => (
                <motion.div key={item} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="relative px-3 py-1 text-gray-800 font-semibold rounded-full overflow-hidden group hover:text-white transition-colors duration-300"
                  >
                    <span className="relative z-10">{item}</span>
                    <motion.div
                      className="absolute inset-0 bg-amber-500 rounded-full"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                    <motion.span className="absolute inset-0 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main
        className={`flex-grow container mx-auto px-4 py-8 transition-all duration-300 ${
          loading ? "blur-sm" : ""
        }`}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to CareerVISION</h1>
          <p className="mb-8">Get started with our amazing features today!</p>
          <motion.div whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}>
            <Button
              size="lg"
              onClick={handleGetStarted} // Use the new handler
              disabled={loading} // Disable button during loading
              className={`bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Loading..." : "Get Started"}
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Banner */}
      <div
        className={`bg-gradient-to-r from-amber-500 to-amber-600 text-white py-8 transition-all duration-300 ${
          loading ? "blur-sm" : ""
        }`}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Join Our Community</h2>
          <p>Stay updated with our latest news and offers!</p>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`bg-gray-800 text-white py-12 transition-all duration-300 ${
          loading ? "blur-sm" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-amber-500">About Us</h3>
              <p className="text-gray-300">
                We are dedicated to providing the best service to our customers, with innovative solutions and unparalleled support.
              </p>
            </div>
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-amber-500">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-amber-500 transition duration-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-amber-500 transition duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-amber-500 transition duration-300">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-xl font-bold mb-4 text-amber-500">Contact Us</h3>
              <p className="text-gray-300">Email: careervisionvvit@gmail.com</p>
              <p className="text-gray-300">Phone: (+91) 90130-47890</p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-amber-500 transition duration-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-amber-500 transition duration-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-400">
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