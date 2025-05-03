import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { FaHospitalSymbol } from 'react-icons/fa';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-healthcare p-4 sm:p-6 md:p-8 relative">
      <div className="medical-grid"></div>
      
      {/* Animated pulse rings */}
      <div className="pulse-ring opacity-20 bg-blue-200" style={{ width: '200px', height: '200px', left: '10%', top: '30%' }}></div>
      <div className="pulse-ring opacity-20 bg-blue-300" style={{ width: '150px', height: '150px', right: '15%', bottom: '20%' }}></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-effect rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10"
      >
        <div className="p-6 sm:p-8">
          <motion.div
            className="medical-symbol flex justify-center mb-6"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
              <div className="relative z-10 text-5xl text-blue-600">
                <FaHospitalSymbol />
              </div>
            </div>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
            {title}
          </h2>
          
          {children}

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Access for all healthcare professionals</p>
            <p>and patients in one secure platform</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}