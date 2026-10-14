"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const categories = ["Music", "Workshop", "Food", "Sports", "Kids"];

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    title: "",
    category: "Music",
    city: "",
    dateTime: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/events/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const event = response.data;
      const date = new Date(event.dateTime);
      const formattedDate = date.toISOString().slice(0, 16);

      setFormData({
        title: event.title,
        category: event.category,
        city: event.city,
        dateTime: formattedDate,
        price: event.price.toString(),
        description: event.description,
        imageUrl: event.imageUrl,
      });
    } catch (err) {
      setError("Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API_URL}/admin/events/${params.id}`,
        {
          ...formData,
          price: parseFloat(formData.price),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date and Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.dateTime}
                onChange={(e) =>
                  setFormData({ ...formData, dateTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard")}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
