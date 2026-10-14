"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, LogOut, Calendar, Plus } from "lucide-react";

export default function AdminNav() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    router.push("/admin/login");
  };

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-blue-400 mr-2" />
            <span className="font-bold text-xl">Admin Panel</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 flex items-center space-x-1"
            >
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </Link>

            <Link
              href="/admin/events/new"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>New Event</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
