// app/emergency-form/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function EmergencyForm() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [photos, setPhotos] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lat || !lng || !photos || !name || !contact) {
      alert("Please fill all fields and upload photo(s).");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("contact", contact);
    formData.append("latitude", lat);
    formData.append("longitude", lng);

    Array.from(photos).forEach((file, index) => {
      formData.append(`photo${index}`, file);
    });

    const response = await fetch("/api/emergency", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Emergency reported successfully.");
    } else {
      alert("Failed to submit emergency.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow mt-10 rounded-xl">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Emergency Report Form
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="tel"
          placeholder="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          multiple
          onChange={(e) => setPhotos(e.target.files)}
          accept="image/*"
          className="w-full"
        />
        <div className="text-sm text-gray-600">
          <p>
            Location: {lat}, {lng}
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Submit Emergency
        </button>
      </form>
    </div>
  );
}
