"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import axios from "axios";
import { formatPrice, formatDate } from "@/lib/utils";
import { Edit, Power, PowerOff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const params: any = { limit: 100 };

      if (filter === "active") params.isActive = "true";
      if (filter === "inactive") params.isActive = "false";

      const response = await axios.get(`${API_URL}/admin/events`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setEvents(response.data.events);
    } catch (err) {
      console.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const toggleEventStatus = async (eventId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${API_URL}/admin/events/${eventId}/status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchEvents();
    } catch (err) {
      console.error("Failed to toggle event status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
          <Link
            href="/admin/events/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            Create New Event
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === "active"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("inactive")}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === "inactive"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event: any) => (
                  <tr key={event._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(event.dateTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(event.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          event.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {event.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/events/${event._id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => toggleEventStatus(event._id)}
                          className={`${
                            event.isActive
                              ? "text-red-600 hover:text-red-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {event.isActive ? (
                            <PowerOff className="w-5 h-5" />
                          ) : (
                            <Power className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {events.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No events found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
