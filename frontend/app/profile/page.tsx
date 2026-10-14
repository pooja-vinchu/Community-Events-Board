"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { User, Check } from "lucide-react";

const categories = ["Music", "Workshop", "Food", "Sports", "Kids"];

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSetup = searchParams.get("setup") === "true";

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      setUser(response.data);
      setSelectedCategories(response.data.favoriteCategories || []);
    } catch (err) {
      console.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const saveCategories = async () => {
    setSaving(true);
    setMessage("");

    try {
      await api.put("/user/categories", { categories: selectedCategories });
      setMessage("Categories saved successfully!");
      setTimeout(() => {
        if (isSetup) {
          router.push("/feed");
        }
      }, 1000);
    } catch (err) {
      setMessage("Failed to save categories");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <User className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {isSetup && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-6">
              <p className="font-semibold mb-2">Welcome! Set up your profile</p>
              <p className="text-sm">
                Choose your favorite event categories to personalize your feed.
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Favorite Categories</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Select categories you&apos;re interested in. Your feed will show
              events from these categories.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`p-4 rounded-lg border-2 font-medium transition ${
                    selectedCategories.includes(category)
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category}</span>
                    {selectedCategories.includes(category) && (
                      <Check className="w-5 h-5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md mb-4 ${
                message.includes("success")
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          <button
            onClick={saveCategories}
            disabled={saving || selectedCategories.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>

          {selectedCategories.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Please select at least one category
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
