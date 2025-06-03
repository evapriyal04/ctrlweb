"use client";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

const amenities = [
  {
    name: "Party Hall",
    icon: "🎉",
    description: "Spacious hall for parties and events.",
  },
  {
    name: "GYM",
    icon: "🏋️‍♂️",
    description: "Modern gym with all equipment.",
  },
  {
    name: "TT Room",
    icon: "🏓",
    description: "Table Tennis room for residents.",
  },
  {
    name: "Pool",
    icon: "🏊‍♂️",
    description: "Swimming pool for all ages.",
  },
  {
    name: "Badminton",
    icon: "🏸",
    description: "Indoor badminton court.",
  },
  {
    name: "Billiards",
    icon: "🎱",
    description: "Billiards and snooker tables.",
  },
  {
    name: "Basketball Court",
    icon: "🏀",
    description: "Outdoor basketball court.",
  },
  {
    name: "Swimming Pool",
    icon: "🤽‍♂️",
    description: "Olympic size swimming pool.",
  },
];

export default function AmenitiesPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#f5e9f2] flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[#222] mb-8">Amenities</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {amenities.map((amenity) => (
            <div
              key={amenity.name}
              className="bg-white rounded-xl shadow flex flex-col items-center justify-between h-full py-8 px-4 hover:shadow-lg transition"
            >
              <div className="flex flex-col items-center w-full flex-1">
                <div className="text-6xl mb-5">{amenity.icon}</div>
                <div className="text-xl font-bold text-[#e41c24] mb-2 text-center">{amenity.name}</div>
                <div className="text-base text-[#444] text-center mb-8">{amenity.description}</div>
              </div>
              <div className="flex gap-3 w-full justify-center mt-auto">
                <button
                  onClick={() =>
                    router.push(
                      `/amenities/bookings?amenity=${encodeURIComponent(amenity.name)}`
                    )
                  }
                  className="px-5 py-2 rounded bg-[#e41c24] text-white font-semibold hover:bg-[#b81a1f] transition text-sm"
                >
                  Book
                </button>
                <button
                  onClick={() =>
                    router.push(
                      `/amenities/logs?amenity=${encodeURIComponent(amenity.name)}`
                    )
                  }
                  className="px-5 py-2 rounded bg-[#22223b] text-white font-semibold hover:bg-[#444] transition text-sm"
                >
                  View Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}