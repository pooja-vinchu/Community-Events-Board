"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">
                Events Board
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/events"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/events"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Events
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  href="/feed"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/feed"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  My Feed
                </Link>
                <Link
                  href="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/profile"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
