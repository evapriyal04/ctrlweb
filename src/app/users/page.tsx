"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

// Dummy users data
const users = [
  {
    name: "Levina Rao",
    email: "levina55@gmail.com",
    role: "President",
    block: "A102",
    phone: "+91 8524567538",
    status: "Active",
  },
  {
    name: "Jennifer Lorem",
    email: "jenniferlorem88@gmail.com",
    role: "Secretary",
    block: "A103",
    phone: "+91 9195195985",
    status: "Active",
  },
  {
    name: "David Smith",
    email: "david@gmail.com",
    role: "Treasurer",
    block: "A101",
    phone: "+91 9845254585",
    status: "Active",
  },
  {
    name: "Alex Abadi",
    email: "alex255@gmail.com",
    role: "Estate Manager",
    block: "B101",
    phone: "+91 9195195985",
    status: "Active",
  },
];

const roles = [
  "President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Joint Treasurer",
  "Estate Manager",
];

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);

  // Placeholder for backend integration
  const filteredUsers = users.filter(
    (u) =>
      (roleFilter === "All" || u.role === roleFilter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="min-h-screen bg-[#f5e9f2] flex">
         <Sidebar /> 
    <div className="min-h-screen bg-[#f5e9f2] p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#222]">User Management</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
          >
            <option value="All">All Roles</option>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            className="bg-[#e41c24] text-white px-4 py-2 rounded font-semibold hover:bg-[#b81a1f] transition"
            onClick={() => setShowAdd(true)}
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-[#222] font-semibold border-b">
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Email</th>
              <th className="py-2 px-2">Role</th>
              <th className="py-2 px-2">Block</th>
              <th className="py-2 px-2">Phone</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-[#888]">
                  No users found.
                </td>
              </tr>
            )}
            {filteredUsers.map((user, idx) => (
              <tr
                key={user.email}
                className={`border-b last:border-b-0 hover:bg-[#f5e9f2] transition`}
              >
                <td className="py-2 px-2 font-medium text-black">{user.name}</td>
                <td className="py-2 px-2 text-black">{user.email}</td>
                <td className="py-2 px-2 text-black">{user.role}</td>
                <td className="py-2 px-2 text-black">{user.block}</td>
                <td className="py-2 px-2 text-black">{user.phone}</td>
                <td className="py-2 px-2 text-black">
                  <span className="inline-block px-2 py-1 rounded bg-[#e41c24]/10 text-[#e41c24] text-xs font-semibold">
                    {user.status}
                  </span>
                </td>
                <td className="py-2 px-2 flex gap-2">
                  <button
                    className="bg-[#e41c24] text-white px-2 py-1 rounded hover:bg-[#b81a1f] transition text-xs"
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button
                    className="bg-[#22223b] text-white px-2 py-1 rounded hover:bg-[#444] transition text-xs"
                    title="Delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal (Placeholder) */}
      {showAdd && (
        <div className="fixed inset-0 bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#222]">Add New User</h2>
            {/* Placeholder form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                setShowAdd(false);
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Name"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
                required
              />
              <select
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
                required
              >
                <option value="">Select Role</option>
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Block"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-[#8882] text-[#222] font-semibold hover:bg-[#e41c24]/10 transition"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#e41c24] text-white font-semibold hover:bg-[#b81a1f] transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>        
      )}
    </div>
    </div>
  );
}