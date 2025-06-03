"use client";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

type Expense = {
  id: number;
  block: string;
  type: string;
  description: string;
  amount: number;
  date: string;
};

// Dummy data for expenses
const expenseData = [
  {
    id: 1,
    block: "A",
    type: "Maintenance",
    description: "Lift repair",
    amount: 5000,
    date: "2025-06-01",
  },
  {
    id: 2,
    block: "B",
    type: "Repair",
    description: "Water pipe replacement",
    amount: 12000,
    date: "2025-06-03",
  },
  {
    id: 3,
    block: "C",
    type: "Utilities",
    description: "Electricity bill",
    amount: 3500,
    date: "2025-06-05",
  },
  {
    id: 4,
    block: "A",
    type: "Amenities",
    description: "Pool cleaning",
    amount: 2000,
    date: "2025-06-07",
  },
  {
    id: 5,
    block: "B",
    type: "Maintenance",
    description: "Painting",
    amount: 8000,
    date: "2025-06-10",
  },
];

const blocks = ["All", "A", "B", "C"];
const types = ["All", "Maintenance", "Repair", "Utilities", "Amenities"];

const dateTypes = [
  "Select",
  "Today",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last 12 Months",
  "This Year",
  "Last Year",
  "Period",
];

function filterByDate(data: Expense[], dateType: string): Expense[] {
  // For demo, just return all. Implement real logic as needed.
  return data;
}


export default function ExpensesPage() {
  const [tab, setTab] = useState<"INCOME" | "EXPENSE" | "REPORT">("EXPENSE");
  const [block, setBlock] = useState("All");
  const [type, setType] = useState("All");
  const [dateType, setDateType] = useState("Select");
  const [search, setSearch] = useState("");

  // Filtered data
  let filtered = expenseData;
  if (block !== "All") filtered = filtered.filter(e => e.block === block);
  if (type !== "All") filtered = filtered.filter(e => e.type === type);
  if (search)
    filtered = filtered.filter(
      e =>
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.type.toLowerCase().includes(search.toLowerCase())
    );
  filtered = filterByDate(filtered, dateType);

  // For graph, group by month (dummy)
  const graphData = [
    { month: "Jan", amount: 17000 },
    { month: "Feb", amount: 19500 },
    { month: "Mar", amount: 16000 },
    { month: "Apr", amount: 22000 },
    { month: "May", amount: 16000 },
    { month: "Jun", amount: 21500 },
    { month: "Jul", amount: 21500 },
    { month: "Aug", amount: 21500 },
  ];

  return (
    <div className="min-h-screen bg-[#f5e9f2] flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[#222] mb-6">Income–Expense Report</h1>
        {/* Tabs */}
        <div className="flex gap-6 border-b mb-6">
          <button
            className={`pb-2 font-semibold transition ${
              tab === "INCOME"
                ? "border-b-4 border-[#e41c24] text-[#e41c24]"
                : "text-[#222] hover:text-[#e41c24]"
            }`}
            onClick={() => setTab("INCOME")}
          >
            INCOME REPORT
          </button>
          <button
            className={`pb-2 font-semibold transition ${
              tab === "EXPENSE"
                ? "border-b-4 border-[#e41c24] text-[#e41c24]"
                : "text-[#222] hover:text-[#e41c24]"
            }`}
            onClick={() => setTab("EXPENSE")}
          >
            EXPENSE REPORT
          </button>
          <button
            className={`pb-2 font-semibold transition ${
              tab === "REPORT"
                ? "border-b-4 border-[#e41c24] text-[#e41c24]"
                : "text-[#222] hover:text-[#e41c24]"
            }`}
            onClick={() => setTab("REPORT")}
          >
            INCOME & EXPENSE REPORT
          </button>
        </div>
        {/* Sub-tabs */}
        <div className="flex gap-8 mb-6">
          <button className="font-semibold text-[#e41c24] border-b-2 border-[#e41c24] pb-1">
            GRAPH
          </button>
          <button className="font-semibold text-[#222] hover:text-[#e41c24] pb-1">
            DATATABLE
          </button>
        </div>
        {/* Graph */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="font-semibold text-[#222] mb-4">
            {tab === "INCOME"
              ? "Income Graph"
              : tab === "EXPENSE"
              ? "Expense Graph"
              : "Income & Expense Graph"}
          </div>
          {/* Dummy bar graph */}
          <div className="w-full h-64 flex items-end gap-4 px-8">
            {graphData.map((d) => (
              <div key={d.month} className="flex flex-col items-center flex-1">
                <div
                  className="w-8 rounded-t bg-[#e41c24] transition"
                  style={{
                    height: `${(d.amount / 25000) * 200}px`,
                  }}
                ></div>
                <span className="text-xs mt-2 text-[#222]">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#222]">Block</label>
            <select
              value={block}
              onChange={e => setBlock(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
            >
              {blocks.map(b => (
                <option key={b} value={b}>
                  {b === "All" ? "All Blocks" : b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#222]">Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
            >
              {types.map(t => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#222]">Date Type</label>
            <select
              value={dateType}
              onChange={e => setDateType(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
            >
              {dateTypes.map(dt => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#222]">Search</label>
            <input
              type="text"
              placeholder="Description or type"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
            />
          </div>
          <button className="bg-[#22223b] text-white px-6 py-2 rounded font-semibold hover:bg-[#444] transition h-10 mt-5">
            GO
          </button>
        </div>
        {/* Data Table */}
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-[#222] font-semibold border-b">
                <th className="py-2 px-2">#</th>
                <th className="py-2 px-2">Block</th>
                <th className="py-2 px-2">Type</th>
                <th className="py-2 px-2">Description</th>
                <th className="py-2 px-2">Amount (₹)</th>
                <th className="py-2 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[#888]">
                    No expenses found.
                  </td>
                </tr>
              )}
              {filtered.map((e, i) => (
                <tr
                  key={e.id}
                  className="border-b last:border-b-0 hover:bg-[#f5e9f2] transition"
                >
                  <td className="py-2 px-2 text-black">{i + 1}</td>
                  <td className="py-2 px-2 text-black">{e.block}</td>
                  <td className="py-2 px-2 text-black">{e.type}</td>
                  <td className="py-2 px-2 text-black">{e.description}</td>
                  <td className="py-2 px-2 text-black">₹ {e.amount.toLocaleString()}</td>
                  <td className="py-2 px-2 text-black">{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}