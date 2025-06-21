"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useDarkMode } from "@/contexts/DarkModeContext";
// import ThemeDebugger from "@/components/ThemeDebugger"; // Add this
import { FaUserTie, FaUserCog, FaUserShield, FaUserFriends, FaUser, FaUserAstronaut } from "react-icons/fa";

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

// Role icons mapping
const roleIcons = {
  "President": <FaUserFriends size={20} className="text-white" />,
  "Secretary": <FaUserTie size={20} className="text-white" />,
  "Joint Secretary": <FaUserCog size={20} className="text-white" />,
  "Treasurer": <FaUser size={20} className="text-white" />,
  "Joint Treasurer": <FaUserShield size={20} className="text-white" />,
  "Estate Manager": <FaUserAstronaut size={20} className="text-white" />,
};

// Role abbreviations for fallback
const roleAbbreviations = {
  "President": "P",
  "Secretary": "S",
  "Joint Secretary": "JS",
  "Treasurer": "T",
  "Joint Treasurer": "JT",
  "Estate Manager": "EM",
};

export function SomePage() {
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Your page content with dark mode classes */}
    </div>
  );
}

export default function DashboardPage() {
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    
    if (!role) {
      // Redirect to login if no role found
      router.push('/');
      return;
    }
    
    setUserRole(role);
    setUserEmail(email || '');
  }, [router]);

  // If no role yet (loading), show loading state
  if (!userRole) {
    return (
      <div className="min-h-screen bg-[#f5e9f2] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-[#22223b] dark:text-white text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5e9f2] dark:bg-gray-900 transition-colors duration-300 flex">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#222] dark:text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[#222] dark:text-white font-medium">Welcome, {userRole}</div>
              {userEmail && (
                <div className="text-sm text-[#666] dark:text-gray-300">{userEmail}</div>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-[#e41c24] flex items-center justify-center shadow-lg">
              {roleIcons[userRole as keyof typeof roleIcons] || (
                <span className="text-white font-bold text-sm">
                  {roleAbbreviations[userRole as keyof typeof roleAbbreviations] || userRole.charAt(0)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {summary.map((item) => (
            <div
              key={item.label}
              className="rounded-xl shadow-lg bg-white dark:bg-gray-800 flex flex-col items-center justify-center py-6 transition-colors duration-300"
              style={{ borderTop: `4px solid ${item.color}` }}
            >
              <div className="text-lg font-semibold text-[#222] dark:text-white">{item.label}</div>
              <div className="text-2xl font-bold mt-2" style={{ color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
        
        {/* Charts & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 col-span-1 lg:col-span-2 transition-colors duration-300">
            <div className="font-semibold mb-4 text-[#222] dark:text-white">Income vs Expense (Dummy)</div>
            <div className="w-full h-48 flex items-end gap-4">
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-[#e41c24] w-8" style={{ height: "60%" }}></div>
                <span className="text-xs mt-2 text-[#666] dark:text-gray-300">Mar</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-[#2d6a4f] w-8" style={{ height: "80%" }}></div>
                <span className="text-xs mt-2 text-[#666] dark:text-gray-300">Apr</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-[#fca311] w-8" style={{ height: "40%" }}></div>
                <span className="text-xs mt-2 text-[#666] dark:text-gray-300">May</span>
              </div>
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1 text-[#666] dark:text-gray-300"><span className="w-3 h-3 bg-[#e41c24] inline-block rounded"></span>Expense</span>
              <span className="flex items-center gap-1 text-[#666] dark:text-gray-300"><span className="w-3 h-3 bg-[#2d6a4f] inline-block rounded"></span>Income</span>
              <span className="flex items-center gap-1 text-[#666] dark:text-gray-300"><span className="w-3 h-3 bg-[#fca311] inline-block rounded"></span>Net</span>
            </div>
          </div>
          {/* Calendar (Dummy) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
            <div className="font-semibold mb-4 text-[#222] dark:text-white">Upcoming Bookings</div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-[#666] dark:text-gray-300">Party Hall</span>
                <span className="text-[#e41c24]">10 May</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666] dark:text-gray-300">GYM</span>
                <span className="text-[#e41c24]">11 May</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666] dark:text-gray-300">Pool</span>
                <span className="text-[#e41c24]">15 May</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-colors duration-300">
            <div className="font-semibold mb-2 text-[#222] dark:text-white">Recent Quotations</div>
            <ul className="text-sm">
              {recentQuotations.map((q, i) => (
                <li key={i} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <span className="text-[#666] dark:text-gray-300">{q.vendor}</span>
                  <span className="text-[#666] dark:text-gray-300">{q.amount}</span>
                  <span className={q.status === "Approved" ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}>{q.status}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-colors duration-300">
            <div className="font-semibold mb-2 text-[#222] dark:text-white">Recent Expenses</div>
            <ul className="text-sm">
              {recentExpenses.map((e, i) => (
                <li key={i} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <span className="text-[#666] dark:text-gray-300">{e.block} Block</span>
                  <span className="text-[#666] dark:text-gray-300">{e.type}</span>
                  <span className="text-[#666] dark:text-gray-300">{e.amount}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-colors duration-300">
            <div className="font-semibold mb-2 text-[#222] dark:text-white">Recent Bookings</div>
            <ul className="text-sm">
              {recentBookings.map((b, i) => (
                <li key={i} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <span className="text-[#666] dark:text-gray-300">{b.amenity}</span>
                  <span className="text-[#666] dark:text-gray-300">{b.user}</span>
                  <span className="text-[#666] dark:text-gray-300">{b.date}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-colors duration-300">
            <div className="font-semibold mb-2 text-[#222] dark:text-white">Recent Complaints</div>
            <ul className="text-sm">
              {recentComplaints.map((c, i) => (
                <li key={i} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <span className="text-[#666] dark:text-gray-300">{c.type}</span>
                  <span className="text-[#666] dark:text-gray-300">{c.user}</span>
                  <span className={c.status === "Open" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}>{c.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      {/* <ThemeDebugger /> Add this for debugging */}
    </div>
  );
}