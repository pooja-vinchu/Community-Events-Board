"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Tag } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface Event {
  _id: string;
  title: string;
  category: string;
  city: string;
  dateTime: string;
  price: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {event.category}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(event.dateTime)}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {event.city}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Tag className="w-4 h-4 mr-2" />
              <span className="font-semibold text-blue-600">
                {formatPrice(event.price)}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
