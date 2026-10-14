import Link from "next/link";
import { Calendar, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Community Events Board
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover exciting local events happening in your city
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Calendar className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Browse Events</h3>
            <p className="text-gray-600">
              Find music nights, workshops, food fairs, and more
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Users className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personalized Feed</h3>
            <p className="text-gray-600">
              Get event recommendations based on your interests
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Sparkles className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Design Cards</h3>
            <p className="text-gray-600">
              Customize event cards with themes and stickers
            </p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Link
              href="/events"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Events
            </Link>
            <Link
              href="/login"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
            >
              Login
            </Link>
          </div>
          <div>
            <Link
              href="/admin/login"
              className="text-gray-600 hover:text-gray-900 underline"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
