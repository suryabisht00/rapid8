'use client';

import { useState } from 'react';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import AuthLayout from '@/app/components/AuthLayout';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import Link from 'next/link';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your API integration here
    console.log('Sign in:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AuthLayout title="Sign In">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <AnimatePresence mode="wait">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              Icon={FaEnvelope}
            />
          </AnimatePresence>

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            Icon={FaLock}
          />

          <div className="flex justify-end">
            <motion.div
              whileHover={{ x: 3 }}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </motion.div>
          </div>

          <Button 
            type="submit"
            variant="primary"
            icon={<FaSignInAlt />}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            href="/signup"
            className="text-blue-600 hover:underline text-sm sm:text-base transition-colors hover:text-blue-700"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
}