"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserTie, FaUserCog, FaUserShield, FaUserFriends, FaUser, FaBook, FaUserAstronaut } from "react-icons/fa";

const roles = [
  "President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Joint Treasurer",
  "Estate Manager",
];

const loginOptions = [
  { label: "President", icon: <FaUserFriends size={32} className="text-[#22223b]" /> },
  { label: "Secretary", icon: <FaUserTie size={32} className="text-[#22223b]" /> },
  { label: "Joint Secretary", icon: <FaUserCog size={32} className="text-[#22223b]" /> },
  { label: "Treasurer", icon: <FaUser size={32} className="text-[#22223b]" /> },
  { label: "Joint Treasurer", icon: <FaUserShield size={32} className="text-[#22223b]" /> },
  { label: "Estate Manager", icon: <FaUserAstronaut size={32} className="text-[#22223b]" /> },
];

export default function LoginPage() {
  const [role, setRole] = useState(roles[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo: Only allow admin/admin
    if (email === "admin@gmail.com" && password === "admin") {
      setMessage("");
      router.push("/dashboard");
    } else {
      setMessage("Invalid credentials. Use admin/admin for demo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e9f2] px-2">
      <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden w-full max-w-4xl border border-[#e6e6e6]">
        {/* Left: Branding & Quick Links */}
        <div className="bg-[#22223b] flex flex-col justify-between p-8 md:w-2/5 min-h-[500px]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/ctrlweb-logo.png" alt="CtrlWeb" className="w-10 h-10 rounded-full bg-white p-1 shadow" />
              <span className="text-2xl font-bold text-white tracking-wide">CtrlWeb AMS</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2 mt-6">Apartment Management System</h2>
            <ul className="space-y-3 mt-6">
              <li>
                <button className="w-full flex items-center gap-2 px-4 py-2 rounded bg-[#e41c24] text-white font-semibold shadow hover:bg-[#b81a1f] transition text-left">
                  <FaUser className="text-lg" /> Apartment Management Login
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-2 px-4 py-2 rounded bg-[#f5e9f2] text-[#22223b] font-semibold shadow hover:bg-[#e41c24] hover:text-white transition text-left">
                  <FaUserFriends className="text-lg" /> Member Registration Page
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-2 px-4 py-2 rounded bg-[#f5e9f2] text-[#22223b] font-semibold shadow hover:bg-[#e41c24] hover:text-white transition text-left">
                  <FaBook className="text-lg" /> Apartment Society Rules
                </button>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2 mt-8">
            <button className="flex items-center gap-2 px-4 py-2 rounded bg-white text-[#22223b] font-semibold shadow hover:bg-[#e41c24] hover:text-white transition">
              <FaBook className="text-lg" /> Help Document
            </button>
          </div>
          <div className="mt-8 text-xs text-[#fff8] text-center">
            © 2025 CtrlWeb. All rights reserved.
          </div>
        </div>
        {/* Right: Login Form */}
        <div className="flex-1 p-10 flex flex-col text-[#222] justify-center bg-white">
          <h1 className="text-2xl font-bold mb-2 text-[#22223b] text-center tracking-tight">
            Welcome to CtrlWeb Society Platform
          </h1>
          <div className="text-center text-[#e41c24] font-semibold mb-6">
            Minimal. Secure. Reliable.
          </div>
          <form className="flex flex-col gap-4 max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border rounded px-4 py-2 flex-1 focus:outline-none text-[#222] focus:ring-2 focus:ring-[#e41c24]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#e41c24]"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="accent-[#e41c24]" />
              <label htmlFor="remember" className="text-sm text-[#222]">Remember Me</label>
            </div>
            <button
              type="submit"
              className="bg-[#22223b] text-white rounded px-4 py-2 font-semibold hover:bg-[#444] transition text-lg tracking-wide"
            >
              LOG IN
            </button>
            {message && (
              <div className="text-center text-[#e41c24] mt-2">{message}</div>
            )}
          </form>
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[#222] font-semibold">Or Login As</span>
              <span className="text-[#e41c24] text-xl">↓</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {loginOptions.map(opt => (
                <div
                  key={opt.label}
                  className="flex flex-col items-center bg-[#f5e9f2] rounded-xl shadow px-6 py-4 hover:bg-[#e41c24] hover:text-white transition cursor-pointer"
                  title={opt.label}
                >
                  {opt.icon}
                  <span className="mt-2 font-semibold text-[#22223b] group-hover:text-white">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}