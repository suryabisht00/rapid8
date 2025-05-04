'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBars, FaTimes, FaHospital, FaSignInAlt, FaUserPlus, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthContext();
  const [mounted, setMounted] = useState(false);
  
  // Handle hydration mismatch by only rendering authenticated content after mount
  useEffect(() => {
    setMounted(true);
    
    // Listen for storage events (which we trigger when auth state changes)
    const handleStorageChange = () => {
      // This will force a re-render of the component
      setMounted(false);
      setTimeout(() => setMounted(true), 0);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Base routes that are always available
  const publicRoutes = [
    { name: 'Home', path: '/', icon: <FaHome className="mr-2" /> },
  ];

  // Routes for authenticated users
  const authRoutes = [
    { name: 'Hospital Dashboard', path: '/hospital/dashboard', icon: <FaHospital className="mr-2" /> },
    { name: 'Emergency Command', path: '/hospital/emrgncyCmdCenter', icon: <FaHospital className="mr-2" /> },
  ];

  // Routes for non-authenticated users
  const nonAuthRoutes = [
    { name: 'Sign In', path: '/signin', icon: <FaSignInAlt className="mr-2" /> },
    { name: 'Sign Up', path: '/signup', icon: <FaUserPlus className="mr-2" /> },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    logout();
    // The router push will now be handled by the logout function in AuthContext
    setIsOpen(false);
  };

  // Determine which routes to show based on authentication status
  const routesToShow = mounted ? [
    ...publicRoutes,
    ...(isAuthenticated ? authRoutes : nonAuthRoutes)
  ] : publicRoutes;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="flex items-center text-blue-600 font-bold text-xl">
                <FaHospital className="mr-2" />
                Rapid8
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {routesToShow.map(route => (
              <Link 
                key={route.path}
                href={route.path}
                className={`ml-4 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  pathname === route.path 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {route.icon}
                {route.name}
              </Link>
            ))}
            
            {/* Logout button for authenticated users */}
            {mounted && isAuthenticated && (
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="sm:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {routesToShow.map(route => (
                <Link 
                  key={route.path}
                  href={route.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    pathname === route.path 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {route.icon}
                  {route.name}
                </Link>
              ))}
              
              {/* Logout button for authenticated users (mobile) */}
              {mounted && isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
