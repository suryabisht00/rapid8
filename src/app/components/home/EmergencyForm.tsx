// app/emergency-form/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EmergencyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract and store lat/lng from search params
  const [formState, setFormState] = useState({
    name: "",
    contact: "",
    lat: searchParams.get("lat"),
    lng: searchParams.get("lng"),
    isInitialized: false
  });
  
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Effect to update lat/lng when search params change
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    
    if (lat && lng) {
      setFormState(prev => ({
        ...prev,
        lat,
        lng,
        isInitialized: true
      }));
    } else if (!formState.isInitialized) {
      setError("Location coordinates are missing. Please enable location services.");
    }
  }, [searchParams, formState.isInitialized]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle photo uploads
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotos(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { lat, lng, name, contact } = formState;
      
      if (!lat || !lng) {
        throw new Error("Location coordinates are missing. Please try again with location enabled.");
      }
      
      if (!name || !contact) {
        throw new Error("Please fill all required fields.");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("contact", contact);
      formData.append("latitude", lat);
      formData.append("longitude", lng);

      if (photos) {
        Array.from(photos).forEach((file, index) => {
          formData.append(`photo${index}`, file);
        });
      }

      // In a real app, you would send this to your API
      // For now, we'll simulate the API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to emergency map page with user coordinates
      router.push(`/emergency-map?userLat=${lat}&userLng=${lng}`);
    } catch (error) {
      console.error("Error submitting emergency:", error);
      setError(error instanceof Error ? error.message : "Failed to submit emergency. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (error && !formState.lat && !formState.lng) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow mt-10 rounded-xl">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Location Error
        </h1>
        <p className="text-gray-700 mb-4">{error}</p>
        <button 
          onClick={() => router.push("/")}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Return to Home Page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow mt-10 rounded-xl">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Emergency Report Form
      </h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formState.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
          <input
            id="contact"
            type="tel"
            name="contact"
            placeholder="Enter your phone number"
            value={formState.contact}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">Photos (Optional)</label>
          <input
            id="photos"
            type="file"
            multiple
            onChange={handlePhotoChange}
            accept="image/*"
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Upload photos of the emergency situation if available</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Your Location</h3>
          <p className="text-sm text-gray-600">
            {formState.lat && formState.lng ? (
              <>Coordinates: {formState.lat}, {formState.lng}</>
            ) : (
              <span className="text-amber-600">Loading location...</span>
            )}
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !formState.lat || !formState.lng}
          className={`w-full ${
            isSubmitting || !formState.lat || !formState.lng 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-red-600 hover:bg-red-700"
          } text-white py-3 rounded flex items-center justify-center`}
        >
          {isSubmitting ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            "Request Emergency Assistance"
          )}
        </button>
      </form>
    </div>
  );
}
