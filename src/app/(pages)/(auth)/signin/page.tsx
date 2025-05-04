"use client";

import { useState } from "react";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import AuthLayout from "@/app/components/ui/AuthLayout";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const { signIn, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      const response = await signIn({
        email: formData.email,
        password: formData.password,
      });
      
      if (response.success) {
        // Set a remember me cookie if selected
        if (formData.rememberMe) {
          document.cookie = "rememberMe=true; max-age=604800; path=/";
        }
        
        // Redirect to home page instead of dashboard
        router.push("/");
      } else {
        setFormError(response.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setFormError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <AuthLayout title="Sign In">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {(error || formError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-4 text-sm bg-red-100 border border-red-300 text-red-700 rounded"
          >
            {error || formError}
          </motion.div>
        )}

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

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            
            <motion.div
              whileHover={{ x: 3 }}
              className="text-sm text-blue-600 hover:underline"
            >
              <Link href="/forgot-password">Forgot password?</Link>
            </motion.div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            icon={<FaSignInAlt />}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
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
