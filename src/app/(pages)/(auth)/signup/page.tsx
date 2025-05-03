"use client";

import { useState } from "react";
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import AuthLayout from "@/app/components/ui/AuthLayout";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Link from "next/link";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your API integration here
    console.log("Sign up:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AuthLayout title="Create Account">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <AnimatePresence mode="wait">
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              Icon={FaUser}
            />
          </AnimatePresence>

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            Icon={FaEnvelope}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            Icon={FaLock}
          />

          <Button type="submit" variant="primary" icon={<FaUserPlus />}>
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/signin"
            className="text-blue-600 hover:underline text-sm sm:text-base transition-colors hover:text-blue-700"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
