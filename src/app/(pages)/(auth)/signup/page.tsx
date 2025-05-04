"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserPlus,
  FaPhone,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import AuthLayout from "@/app/components/ui/AuthLayout";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default function SignUp() {
  const router = useRouter();
  const { signUp, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "ambulanceStaff",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Updated validation to include phone
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.phone
    ) {
      setFormError("Please fill all fields");
      return;
    }

    setFormError(null);
    
    try {
      const response = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      });
      
      if (response.success) {
        // Redirect to sign in page with a full page refresh
        window.location.href = "/signin";
      } else {
        setFormError(response.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setFormError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
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
        {(authError || formError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-4 text-sm bg-red-100 border border-red-300 text-red-700 rounded"
          >
            {authError || formError}
          </motion.div>
        )}

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
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
            Icon={FaPhone}
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

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="ambulanceStaff"
                  checked={formData.role === "ambulanceStaff"}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Ambulance Staff</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="hospitalStaff"
                  checked={formData.role === "hospitalStaff"}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Hospital Staff</span>
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            icon={<FaUserPlus />}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
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
