"use client";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Dummy logs data
const initialLogs = [
  {
    id: "LOG-0001",
    name: "John Doe",
    amenity: "TT Room",
    block: "A",
    flat: "101",
    slot: "08:00 - 09:00",
    date: "2025-06-02"
  },
  {
    id: "LOG-0002",
    name: "Priya Singh",
    amenity: "GYM",
    block: "B",
    flat: "202",
    slot: "07:00 - 08:00",
    date: "2025-06-01"
  },
  {
    id: "LOG-0003",
    name: "David Smith",
    amenity: "Party Hall",
    block: "C",
    flat: "303",
    slot: "18:00 - 20:00",
    date: "2025-05-30"
  },
  {
    id: "LOG-0004",
    name: "Ayesha Khan",
    amenity: "Swimming Pool",
    block: "A",
    flat: "105",
    slot: "10:00 - 11:00",
    date: "2025-05-29"
  },
];

export default function AmenitiesLogsPage() {
  const [search, setSearch] = useState("");
  const [logs] = useState(initialLogs);

  const filteredLogs = logs.filter(
    (log) =>
      log.name.toLowerCase().includes(search.toLowerCase()) ||
      log.amenity.toLowerCase().includes(search.toLowerCase()) ||
      log.block.toLowerCase().includes(search.toLowerCase()) ||
      log.flat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5e9f2] flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[#222] mb-6">Amenities Usage Logs</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name, amenity, block, or flat"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white w-full md:w-80"
          />
        </div>
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-[#222] font-semibold border-b">
                <th className="py-2 px-2">Log ID</th>
                <th className="py-2 px-2">Name</th>
                <th className="py-2 px-2">Amenity</th>
                <th className="py-2 px-2">Block</th>
                <th className="py-2 px-2">Flat No</th>
                <th className="py-2 px-2">Time Slot</th>
                <th className="py-2 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-[#888]">
                    No logs found.
                  </td>
                </tr>
              )}
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b last:border-b-0 hover:bg-[#f5e9f2] transition"
                >
                  <td className="py-2 px-2 font-mono text-black">{log.id}</td>
                  <td className="py-2 px-2 text-black">{log.name}</td>
                  <td className="py-2 px-2 text-black">{log.amenity}</td>
                  <td className="py-2 px-2 text-black">{log.block}</td>
                  <td className="py-2 px-2 text-black">{log.flat}</td>
                  <td className="py-2 px-2 text-black">{log.slot}</td>
                  <td className="py-2 px-2 text-black">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}