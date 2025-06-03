"use client";
import Sidebar from "@/components/Sidebar";

const summary = [
  { label: "Users", value: 120, color: "#e41c24" },
  { label: "Assets", value: 45, color: "#22223b" },
  { label: "Expenses (This Month)", value: "₹1,20,000", color: "#fca311" },
  { label: "Amenities", value: 8, color: "#14213d" },
  { label: "Invoices", value: 32, color: "#2d6a4f" },
  { label: "Quotations", value: 9, color: "#4361ee" },
];

const recentQuotations = [
  { vendor: "ABC Corp", amount: "₹12,000", status: "Pending" },
  { vendor: "XYZ Pvt Ltd", amount: "₹8,500", status: "Approved" },
  { vendor: "HomeFix", amount: "₹15,000", status: "Pending" },
];

const recentExpenses = [
  { block: "A", type: "Maintenance", amount: "₹5,000", date: "2024-05-01" },
  { block: "B", type: "Repair", amount: "₹12,000", date: "2024-05-03" },
  { block: "C", type: "Utilities", amount: "₹3,500", date: "2024-05-05" },
];

const recentBookings = [
  { amenity: "Party Hall", user: "John Doe", date: "2024-05-10" },
  { amenity: "GYM", user: "Jane Smith", date: "2024-05-11" },
];

const recentComplaints = [
  { type: "Maintenance", user: "Amit", date: "2024-05-02", status: "Open" },
  { type: "Noise", user: "Priya", date: "2024-05-03", status: "Closed" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f5e9f2] flex">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#222]">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-[#222] font-medium">Welcome, Admin</span>
            <div className="w-10 h-10 rounded-full bg-[#e41c24] flex items-center justify-center text-white font-bold">A</div>
          </div>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {summary.map((item) => (
            <div
              key={item.label}
              className="rounded-xl shadow bg-white flex flex-col items-center justify-center py-6"
              style={{ borderTop: `4px solid ${item.color}` }}
            >
              <div className="text-lg font-semibold text-[#222]">{item.label}</div>
              <div className="text-2xl font-bold mt-2" style={{ color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
        {/* Charts & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6 col-span-1 lg:col-span-2">
            <div className="font-semibold mb-4 text-[#222]">Income vs Expense (Dummy)</div>
            <div className="w-full h-48 flex items-end gap-4">
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-[#e41c24] w-8" style={{ height: "60%" }}></div>
                <span className="text-xs mt-2">Mar</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-[#2d6a4f] w-8" style={{ height: "80%" }}></div>
                <span className="text-xs mt-2">Apr</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-[#fca311] w-8" style={{ height: "40%" }}></div>
                <span className="text-xs mt-2">May</span>
              </div>
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#e41c24] inline-block rounded"></span>Expense</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#2d6a4f] inline-block rounded"></span>Income</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#fca311] inline-block rounded"></span>Net</span>
            </div>
          </div>
          {/* Calendar (Dummy) */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold mb-4 text-[#222]">Upcoming Bookings</div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Party Hall</span>
                <span className="text-[#e41c24]">10 May</span>
              </div>
              <div className="flex justify-between">
                <span>GYM</span>
                <span className="text-[#e41c24]">11 May</span>
              </div>
              <div className="flex justify-between">
                <span>Pool</span>
                <span className="text-[#e41c24]">15 May</span>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Activity Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-2 text-[#222]">Recent Quotations</div>
            <ul className="text-sm">
              {recentQuotations.map((q, i) => (
                <li key={i} className="flex justify-between py-1 border-b last:border-b-0">
                  <span>{q.vendor}</span>
                  <span>{q.amount}</span>
                  <span className={q.status === "Approved" ? "text-green-600" : "text-yellow-600"}>{q.status}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-2 text-[#222]">Recent Expenses</div>
            <ul className="text-sm">
              {recentExpenses.map((e, i) => (
                <li key={i} className="flex justify-between py-1 border-b last:border-b-0">
                  <span>{e.block} Block</span>
                  <span>{e.type}</span>
                  <span>{e.amount}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-2 text-[#222]">Recent Bookings</div>
            <ul className="text-sm">
              {recentBookings.map((b, i) => (
                <li key={i} className="flex justify-between py-1 border-b last:border-b-0">
                  <span>{b.amenity}</span>
                  <span>{b.user}</span>
                  <span>{b.date}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-2 text-[#222]">Recent Complaints</div>
            <ul className="text-sm">
              {recentComplaints.map((c, i) => (
                <li key={i} className="flex justify-between py-1 border-b last:border-b-0">
                  <span>{c.type}</span>
                  <span>{c.user}</span>
                  <span className={c.status === "Open" ? "text-yellow-600" : "text-green-600"}>{c.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}