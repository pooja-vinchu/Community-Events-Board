"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import { Calendar, MapPin, Tag, Bell, BellOff, Sparkles } from "lucide-react";

const themes = [
  { id: "gradient-blue", name: "Blue" },
  { id: "gradient-purple", name: "Purple" },
  { id: "gradient-orange", name: "Orange" },
];

const availableStickers = ["🎉", "🎵", "🍕", "⚽", "🎨"];

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasReminder, setHasReminder] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderError, setReminderError] = useState("");

  const [cardDesign, setCardDesign] = useState({
    theme: "gradient-blue",
    stickers: [] as string[],
  });
  const [savingDesign, setSavingDesign] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchEvent();
    if (token) {
      checkReminder();
      fetchCardDesign();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${params.id}`);
      setEvent(response.data);
    } catch (err) {
      setError("Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };

  const checkReminder = async () => {
    try {
      const response = await api.get("/user/reminders");
      setHasReminder(response.data.reminders.includes(params.id));
    } catch (err) {
      console.error("Failed to check reminder");
    }
  };

  const fetchCardDesign = async () => {
    try {
      const response = await api.get(`/user/events/${params.id}/card-design`);
      setCardDesign(response.data);
    } catch (err) {
      console.error("Failed to fetch card design");
    }
  };

  const toggleReminder = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setReminderLoading(true);
    setReminderError("");

    const originalState = hasReminder;
    setHasReminder(!hasReminder);

    try {
      await api.post(`/user/reminders/${params.id}`);
    } catch (err: any) {
      setHasReminder(originalState);
      setReminderError(
        err.response?.data?.error || "Failed to update reminder",
      );
      setTimeout(() => setReminderError(""), 3000);
    } finally {
      setReminderLoading(false);
    }
  };

  const changeTheme = async (themeId: string) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const newDesign = { ...cardDesign, theme: themeId };
    setCardDesign(newDesign);
    await saveCardDesign(newDesign);
  };

  const toggleSticker = async (sticker: string) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    let newStickers = [...cardDesign.stickers];
    const index = newStickers.indexOf(sticker);

    if (index > -1) {
      newStickers.splice(index, 1);
    } else {
      if (newStickers.length < 3) {
        newStickers.push(sticker);
      }
    }

    const newDesign = { ...cardDesign, stickers: newStickers };
    setCardDesign(newDesign);
    await saveCardDesign(newDesign);
  };

  const saveCardDesign = async (design: any) => {
    setSavingDesign(true);
    try {
      await api.post(`/user/events/${params.id}/card-design`, design);
    } catch (err) {
      console.error("Failed to save card design");
    } finally {
      setSavingDesign(false);
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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600">{error || "Event not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-96">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  {event.category}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {event.title}
                </h1>
              </div>

              {isLoggedIn && (
                <button
                  onClick={toggleReminder}
                  disabled={reminderLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition ${
                    hasReminder
                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } disabled:opacity-50`}
                >
                  {hasReminder ? (
                    <>
                      <BellOff className="w-5 h-5" />
                      <span>Remove Reminder</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5" />
                      <span>Remind Me</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {reminderError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                {reminderError}
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                <span className="text-lg">{formatDate(event.dateTime)}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                <span className="text-lg">{event.city}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Tag className="w-5 h-5 mr-3 text-blue-600" />
                <span className="text-xl font-semibold text-blue-600">
                  {formatPrice(event.price)}
                </span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-3">About This Event</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold">Design Your Card</h2>
          </div>

          {!isLoggedIn && (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-6">
              Please login to customize your event card
            </div>
          )}

          <div
            className={`relative transition-all duration-500 ${cardDesign.theme} rounded-lg p-8 text-white mb-6 overflow-hidden`}
          >
            <div className="relative z-10">
              <p className="text-sm opacity-90 mb-2">{event.category}</p>
              <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
              <p className="text-sm opacity-90">{formatDate(event.dateTime)}</p>
              <p className="text-sm opacity-90">{event.city}</p>
            </div>

            {cardDesign.stickers.map((sticker, index) => (
              <div
                key={index}
                className="absolute text-4xl animate-pulse"
                style={{
                  top: `${20 + index * 25}%`,
                  right: `${10 + index * 15}%`,
                  transform: `rotate(${index * 15}deg)`,
                }}
              >
                {sticker}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Choose Theme</h3>
              <div className="flex space-x-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => changeTheme(theme.id)}
                    disabled={!isLoggedIn || savingDesign}
                    className={`flex-1 ${theme.id} rounded-lg p-4 text-white font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      cardDesign.theme === theme.id
                        ? "ring-4 ring-gray-900"
                        : ""
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Add Stickers (up to 3)</h3>
              <div className="flex space-x-3">
                {availableStickers.map((sticker) => (
                  <button
                    key={sticker}
                    onClick={() => toggleSticker(sticker)}
                    disabled={!isLoggedIn || savingDesign}
                    className={`text-4xl p-4 rounded-lg border-2 hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      cardDesign.stickers.includes(sticker)
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {sticker}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {cardDesign.stickers.length} / 3 stickers selected
              </p>
            </div>

            {savingDesign && (
              <p className="text-sm text-blue-600">Saving design...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
