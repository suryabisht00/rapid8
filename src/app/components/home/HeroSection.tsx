"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Fix: Import useRouter
import { FaMapMarkedAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useGeolocation from "@/app/hooks/useGeolocation";
import SosButton from "./SosButton";

interface HeroSectionProps {
  scrollIndicatorVisible?: boolean;
}

export default function HeroSection({
  scrollIndicatorVisible = true,
}: HeroSectionProps) {
  const [showSOSDetails, setShowSOSDetails] = useState(false);
  const geolocation = useGeolocation();
  const router = useRouter(); // ✅ Fix: Initialize router

  // Handle SOS button click
  const handleSOSClick = () => {
    setShowSOSDetails(true);
    geolocation.getCurrentPosition(); // Get location
  };

  // Redirect when location is obtained
  useEffect(() => {
    if (
      !geolocation.loading &&
      geolocation.data.latitude &&
      geolocation.data.longitude
    ) {
      router.push(
        `/emergency-form?lat=${geolocation.data.latitude}&lng=${geolocation.data.longitude}`
      );
      setShowSOSDetails(false); // Close modal after redirect 
    }
  }, [geolocation, router]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-full flex flex-col items-center justify-center flex-grow">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10 z-10 w-full max-w-3xl"
        >
          <motion.h1
            className="text-4xl md:text-7xl font-bold text-white mb-4 md:mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block">Emergency</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Healthcare Portal
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-blue-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Immediate assistance when you need it most
          </motion.p>
        </motion.div>

        {/* SOS Button - Now better centered */}
        <motion.div
          className="relative z-10 my-4 md:my-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SosButton onClick={handleSOSClick} />
          <p className="mt-4 text-white font-medium">
            Press for Emergency Assistance
          </p>
        </motion.div>
      </div>

      {/* Emergency Details Modal */}
      <AnimatePresence>
        {showSOSDetails && geolocation.loading && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-xl max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Emergency Signal Sent
              </h2>

              <div className="mb-4">
                {geolocation.loading ? (
                  <p>Obtaining your location...</p>
                ) : geolocation.error ? (
                  <p className="text-red-500">Error: {geolocation.error}</p>
                ) : (
                  <div>
                    <p>Location found:</p>
                    <p className="text-sm text-gray-500">
                      {geolocation.data.latitude?.toFixed(6)},{" "}
                      {geolocation.data.longitude?.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaMapMarkedAlt className="text-red-600 text-xl" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSOSDetails(false)}
                className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator */}
      {scrollIndicatorVisible && (
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
          animate={{
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-white flex flex-col items-center">
            <p className="mb-2">Scroll Down</p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </section>
  );
}
