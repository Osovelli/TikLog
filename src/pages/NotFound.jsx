import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Search, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()
  const [isSearching, setIsSearching] = useState(false)
  const [showElements, setShowElements] = useState(true)

  // Trigger disappearing animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowElements(false)
      setTimeout(() => setShowElements(true), 2000)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Handle search animation
  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => setIsSearching(false), 3000)
  }

  // Navigation handlers
  const goHome = () => navigate("/")
  const goBack = () => navigate(-1)
  const refreshPage = () => window.location.reload()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence>
          {showElements && (
            <>
              {/* Floating geometric shapes */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-blue-200 rounded-full opacity-30"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: 0,
                  }}
                  animate={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: [0, 1, 0],
                    rotate: 360,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Disappearing squares */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`square-${i}`}
                  className="absolute w-6 h-6 bg-purple-200 opacity-20"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  initial={{ opacity: 0.2, scale: 1 }}
                  animate={{
                    opacity: [0.2, 0.5, 0],
                    scale: [1, 1.2, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 5,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Main content container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Animated 404 with searching character */}
          <div className="relative">
            <motion.h1
              className="text-8xl md:text-9xl font-bold text-gray-800 select-none"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              aria-label="Error 404"
            >
              4
              <motion.span
                className="relative inline-block"
                animate={{
                  rotate: isSearching ? [0, -10, 10, -5, 5, 0] : 0,
                  scale: isSearching ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                0{/* Magnifying glass character */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 md:w-16 md:h-16"
                  animate={{
                    x: isSearching ? [0, 10, -10, 5, -5, 0] : [0, 5, 0],
                    y: isSearching ? [0, -5, 5, -2, 2, 0] : [0, -2, 0],
                    rotate: isSearching ? [0, 15, -15, 8, -8, 0] : [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: isSearching ? 1.5 : 3,
                    repeat: isSearching ? 2 : Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Search className="w-full h-full text-blue-500" strokeWidth={2} aria-hidden="true" />
                </motion.div>
              </motion.span>
              4
            </motion.h1>

            {/* Floating question marks */}
            <AnimatePresence>
              {isSearching && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-2xl md:text-3xl text-gray-400 font-bold"
                      style={{
                        left: `${30 + i * 20}%`,
                        top: `${20 + i * 10}%`,
                      }}
                      initial={{ opacity: 0, scale: 0, y: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0],
                        y: [0, -20, -40],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        ease: "easeOut",
                      }}
                      aria-hidden="true"
                    >
                      ?
                    </motion.span>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Error message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">Oops! Page Not Found</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              The page you're looking for seems to have vanished into thin air. Don't worry, even our search magnifying
              glass is having trouble finding it!
            </p>
          </motion.div>

          {/* Interactive search button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="mb-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:opacity-70"
              aria-label={isSearching ? "Searching for page" : "Search for the missing page"}
            >
              <motion.div className="flex items-center space-x-2" animate={{ opacity: isSearching ? 0.7 : 1 }}>
                <Search className={`w-4 h-4 ${isSearching ? "animate-pulse" : ""}`} aria-hidden="true" />
                <span>{isSearching ? "Searching..." : "Search for Page"}</span>
              </motion.div>
            </Button>
          </motion.div>

          {/* Navigation buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={goHome}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 min-w-[140px]"
              aria-label="Go to homepage"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>Go Home</span>
            </Button>

            {/* <Button
              onClick={goBack}
              variant="outline"
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 min-w-[140px] bg-transparent"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Go Back</span>
            </Button>

            <Button
              onClick={refreshPage}
              variant="outline"
              className="border-2 border-purple-300 hover:border-purple-400 text-purple-700 hover:text-purple-800 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 min-w-[140px] bg-transparent"
              aria-label="Refresh current page"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Refresh</span>
            </Button> */}
          </motion.div>

          {/* Help text */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-sm text-gray-500 mt-8"
          >
            <p>
              If you believe this is an error, please{" "}
              <button
                onClick={() => (window.location.href = "mailto:support@example.com")}
                className="text-blue-500 hover:text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label="Contact support via email"
              >
                contact our support team
              </button>
            </p>
          </motion.div> */}
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />

        <motion.div
          className="absolute -bottom-10 -right-10 w-16 h-16 bg-pink-200 rounded-full opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isSearching && "Searching for the missing page..."}
      </div>
    </div>
  )
}
