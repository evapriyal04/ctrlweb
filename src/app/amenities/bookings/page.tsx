"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const timeSlots = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
];

export default function Bookings() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amenity = searchParams.get("amenity") || "Amenity";

  const [form, setForm] = useState({
    name: "",
    block: "",
    flat: "",
    slot: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for backend integration
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      router.push("/amenities");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f5e9f2] flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#e41c24] mb-6 text-center">
          Book {amenity}
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
            required
          />
          <input
            type="text"
            placeholder="Block"
            value={form.block}
            onChange={e => setForm(f => ({ ...f, block: e.target.value }))}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
            required
          />
          <input
            type="text"
            placeholder="Flat No"
            value={form.flat}
            onChange={e => setForm(f => ({ ...f, flat: e.target.value }))}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
            required
          />
          <select
            value={form.slot}
            onChange={e => setForm(f => ({ ...f, slot: e.target.value }))}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
            required
          >
            <option value="">Select Time Slot</option>
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-[#e41c24] text-white font-semibold hover:bg-[#b81a1f] transition"
          >
            Confirm Booking
          </button>
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-1 rounded bg-[#22223b] text-white font-semibold hover:bg-[#444] transition text-sm inline-flex items-center"
            >
              ← Back
            </button>
          </div>
        </form>
        {success && (
          <div className="mt-4 text-green-600 text-center font-semibold">
            Booking Confirmed!
          </div>
        )}
      </div>
    </div>
  );
}