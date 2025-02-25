'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion, useAnimation } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronRight, ArrowRight, Users, Rocket, Target } from 'lucide-react'

export default function GetStartedPage() {
  const router = useRouter()
  const controls = useAnimation()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } })
  }, [controls])

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900">
      {/* Navigation Bar */}
      <motion.nav 
        className={`py-4 px-6 sticky top-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
        }`}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link href="/" className="text-3xl font-extrabold">
                <span className="text-amber-500">Career</span>
                <span className="text-white">VISION</span>
              </Link>
            </motion.div>
            <div className="hidden md:flex space-x-1">
              {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
                <motion.div
                  key={item}
                  variants={itemVariants}
                >
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
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
      <main className="flex-grow container mx-auto px-4 py-16">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
        >
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              size="lg"
              onClick={() => router.push('/chosen')}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
            >
              Get Started <ChevronRight className="ml-2" />
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
        className="bg-amber-500 text-gray-900 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8">Join thousands of professionals who've transformed their careers with CareerVISION</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => router.push('/chosen')}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:translate-y-[-2px]"
            >
              Start Your Journey <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-amber-500">About CareerVISION</h3>
              <p className="text-gray-400">We empower individuals to achieve their professional goals through innovative career development solutions.</p>
            </div>
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-amber-500">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-400 hover:text-amber-500 transition duration-300">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-amber-500 transition duration-300">Privacy Policy</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-amber-500 transition duration-300">FAQ</Link></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-xl font-bold mb-4 text-amber-500">Contact Us</h3>
              <p className="text-gray-400">Email: info@careervision.com</p>
              <p className="text-gray-400">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-500">
            <p>&copy; 2023 CareerVISION. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

