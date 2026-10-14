"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import api from "@/lib/api";
import { Heart } from "lucide-react";

export default function FeedPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchFeed();
  }, [pagination.page]);

  const fetchFeed = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      const response = await api.get("/user/feed", { params });
      setEvents(response.data.events);
      setPagination(response.data.pagination);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login");
      } else {
        setError("Failed to fetch your feed");
      }
    } finally {
      setLoading(false);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Heart className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">My Feed</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {events.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              No events found in your feed
            </p>
            <p className="text-gray-500 mb-6">
              Events matching your favorite categories will appear here
            </p>
            <Link
              href="/profile"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
            >
              Update Your Preferences
            </Link>
          </div>
        )}

        {events.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event: any) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <span className="text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
