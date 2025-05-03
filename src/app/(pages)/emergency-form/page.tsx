"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useEmergencyService } from "@/app/hooks/useEmergencyService";

// Main component that wraps the content in Suspense
export default function EmergencyForm() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <EmergencyFormContent />
    </Suspense>
  );
}

// Loading UI component
function LoadingUI() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-700">Loading emergency form...</p>
      </div>
    </div>
  );
}

// Inner component that contains all the original logic
function EmergencyFormContent() {
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
  const { sendEmergencyRequest, loading } = useEmergencyService();

  useEffect(() => {
    if (lat && lng) {
      setIsReady(true);
      setFormData({
        name: "Emergency User",
        mobile: "9876543210",
        photo: null,
      });
    }
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

    let photoToUse = formData.photo;
    if (!photoToUse) {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 100, 100);
        canvas.toBlob((blob) => {
          if (blob) {
            photoToUse = new File([blob], "emergency.png", { type: "image/png" });
          }
        });
      }
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("mobile", formData.mobile);
    data.append("photo", photoToUse || new Blob());
    data.append("latitude", lat as string);
    data.append("longitude", lng as string);

    try {
      const response = await sendEmergencyRequest(data);

      if (response.success) {
        alert("✅ Emergency Request Sent! Ambulance is on the way.");
        
        // Pass ambulanceId to the emergency map page
        router.push(
          `/emergency-map?userLat=${lat}&userLng=${lng}&ambulanceId=${response.ambulanceId}&eta=${response.estimatedTime}`
        );
      }
    } catch (error) {
      alert("❌ Network error.");
      console.error(error);
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
              Please confirm your details for emergency assistance
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
                value={formData.name}
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
                value={formData.mobile}
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
                Upload Photo (Optional)
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
                Your Location
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
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  "Submit Emergency Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
