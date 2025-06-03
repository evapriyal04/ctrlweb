"use client";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

// Dummy invoice data
const initialInvoices = [
  {
    id: "INV-00304",
    member: "David Smith",
    building: "Sapata Hexa",
    unit: "N/A",
    amenity: "Water Charges",
    total: 0,
    due: 0,
    paid: 0,
    status: "Unpaid",
    date: "01/06/2025 to 28/01/2025",
    image: "🧾",
  },
  {
    id: "INV-00279",
    member: "David Smith",
    building: "Sapata Hexa",
    unit: "N/A",
    amenity: "Maintenance Charges",
    total: 0,
    due: 0,
    paid: 0,
    status: "Unpaid",
    date: "31/08/2024 to 26/01/2025",
    image: "🧾",
  },
  {
    id: "INV-00268",
    member: "David Smith",
    building: "Sapata Hexa",
    unit: "N/A",
    amenity: "Maintenance Charges",
    total: 113197750,
    due: 113197750,
    paid: 0,
    status: "Unpaid",
    date: "29/07/2024 to 27/12/2024",
    image: "🧾",
  },
  {
    id: "INV-00246",
    member: "David Smith",
    building: "Sapata Hexa",
    unit: "N/A",
    amenity: "Maintenance Charges",
    total: 56598874,
    due: 56598874,
    paid: 0,
    status: "Unpaid",
    date: "29/07/2024 to 27/12/2024",
    image: "🧾",
  },
  {
    id: "INV-00245",
    member: "David Smith",
    building: "Sapata Hexa",
    unit: "N/A",
    amenity: "Maintenance Charges",
    total: 522,
    due: 0,
    paid: 522,
    status: "Fully Paid",
    date: "23/07/2024 to 22/08/2024",
    image: "🧾",
  },
];

type InvoiceStatus = "Unpaid" | "Fully Paid";

const statusColors: Record<InvoiceStatus, string> = {
  Unpaid: "text-red-600",
  "Fully Paid": "text-green-600",
};


export default function InvoicesPage() {
    
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [invoices] = useState(initialInvoices);
  const filteredInvoices = invoices.filter(
    (inv) =>
      (statusFilter === "All" || inv.status === statusFilter) &&
      (inv.member.toLowerCase().includes(search.toLowerCase()) ||
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.amenity.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f5e9f2] flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-[#222]">Invoices</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by member, invoice, or amenity"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
            >
              <option value="All">All Status</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Fully Paid">Fully Paid</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-[#222] font-semibold border-b">
                <th className="py-2 px-2">Image</th>
                <th className="py-2 px-2">Invoice Number</th>
                <th className="py-2 px-2">Member Name</th>
                <th className="py-2 px-2">Building Name</th>
                <th className="py-2 px-2">Unit Name</th>
                <th className="py-2 px-2">Charge Type</th>
                <th className="py-2 px-2">Total Amount</th>
                <th className="py-2 px-2">Due Amount</th>
                <th className="py-2 px-2">Paid Amount</th>
                <th className="py-2 px-2">Payment Status</th>
                <th className="py-2 px-2">Start Date To End Date</th>
                <th className="py-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center py-6 text-[#888]">
                    No invoices found.
                  </td>
                </tr>
              )}
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b last:border-b-0 hover:bg-[#f5e9f2] transition"
                >
                  <td className="py-2 px-2 text-2xl text-center">{inv.image}</td>
                  <td className="py-2 px-2 font-mono text-black">{inv.id}</td>
                  <td className="py-2 px-2 text-black ">{inv.member}</td>
                  <td className="py-2 px-2 text-black">{inv.building}</td>
                  <td className="py-2 px-2 text-black">{inv.unit}</td>
                  <td className="py-2 px-2 text-black">{inv.amenity}</td>
                  <td className="py-2 px-2 text-black">₹ {inv.total.toLocaleString()}</td>
                  <td className="py-2 px-2 text-black">₹ {inv.due.toLocaleString()}</td>
                  <td className="py-2 px-2 text-black">₹ {inv.paid.toLocaleString()}</td>
                  <td className={`py-2 px-2 text-black font-semibold ${statusColors[inv.status as InvoiceStatus]}`}>
                        {inv.status}
                  </td>
                  <td className="py-2 px-2 text-black">{inv.date}</td>
                  <td className="py-2 px-2">
                    <button
                      className="bg-[#e41c24] text-white px-3 py-1 rounded font-semibold hover:bg-[#b81a1f] transition text-xs"
                      title="View Invoice"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Add Invoice Button */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-[#22223b] text-white px-6 py-2 rounded font-semibold hover:bg-[#444] transition"
            // onClick={...} // Placeholder for add invoice modal or page
          >
            + Add Invoice
          </button>
        </div>
      </main>
    </div>
  );
}