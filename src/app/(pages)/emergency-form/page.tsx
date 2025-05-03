"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EmergencyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    photo: null as File | null,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (lat && lng) setIsReady(true);
  }, [lat, lng]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files?.[0]) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.photo || !formData.name || !formData.mobile || !lat || !lng) {
      alert("Please fill all fields and upload a photo.");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("condition", "serious"); // Default condition
      data.append("location", lat); // Backend expects single coordinate
      data.append("phone", formData.mobile);
      
      if (formData.photo instanceof File) {
        data.append("image", formData.photo); // Changed from 'photo' to 'image'
      }

      console.log('Submitting data:', Object.fromEntries(data));

      const res = await fetch("https://rapid8-backend.onrender.com/api/sos", {
        method: "POST",
        body: data,
      });

      const responseData = await res.json();
      console.log('Server response:', responseData);

      if (res.ok) {
        alert("✅ Emergency Request Sent!");
        router.push("/");
      } else {
        alert(`❌ Error: ${responseData.message || 'Something went wrong'}`);
      } 
    } catch (error) {
      console.error('Submission error:', error);
      alert("❌ Network error. Please try again.");
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-red-600">
              Emergency Assistance Request
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please fill out the form below to request emergency assistance
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                required
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="Enter your mobile number"
                required
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Photo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="photo"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
              {formData.photo && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {formData.photo.name}
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Location Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Latitude</p>
                  <p className="text-sm font-semibold">{lat}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Longitude</p>
                  <p className="text-sm font-semibold">{lng}</p>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Submit Emergency Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}