// pages/emergency-form.tsx
import { useRouter } from "next/router";
import { useState } from "react";

export default function EmergencyForm() {
  const router = useRouter();
  const { lat, lng } = router.query;

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    photo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files) {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("mobile", formData.mobile);
    data.append("photo", formData.photo as Blob);
    data.append("latitude", lat as string);
    data.append("longitude", lng as string);

    const res = await fetch("/api/emergency", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      alert("Emergency Request Sent!");
      router.push("/");
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-red-600">
        Emergency Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          required
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="file"
          name="photo"
          accept="image/*"
          required
          onChange={handleChange}
          className="w-full"
        />
        <div className="text-gray-600">
          <p>
            <strong>Latitude:</strong> {lat}
          </p>
          <p>
            <strong>Longitude:</strong> {lng}
          </p>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Submit Emergency Request
        </button>
      </form>
    </div>
  );
}
