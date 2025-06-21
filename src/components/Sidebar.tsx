"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronRight, FaChevronDown, FaUser, FaBuilding, FaCog, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "User Management", href: "/users" },
  {
    label: "Quotations",
    href: "/quotations",
    children: [
      { label: "Vendor", href: "/quotations/vendor", icon: <FaUser /> },
      { label: "Supplier", href: "/quotations/supplier", icon: <FaBuilding /> },
    ],
  },
  { label: "Assets", href: "/assets" },
  { label: "Expenses", href: "/expenses" },
  { label: "Amenities", href: "/amenities" },
  { label: "Invoices", href: "/invoices" },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const pathname = usePathname();
  const router = useRouter();

  const handleDropdown = (label: string) => {
    if (label === "Settings") {
      setShowSettings(!showSettings);
      setOpenDropdown(null);
    } else {
      setOpenDropdown(openDropdown === label ? null : label);
      setShowSettings(false);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    // Redirect to login page
    router.push('/');
  };

  return (
    <aside
      className={`transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      } bg-[#e41c24] text-white flex flex-col py-8 px-2 min-h-screen relative`}
    >
      {/* Toggle Button */}
      <button
        className="absolute top-4 right-[-16px] bg-[#e41c24] border-2 border-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-[#b81a1f] transition"
        onClick={() => setIsExpanded((open) => !open)}
        aria-label={isExpanded ? "Close sidebar" : "Open sidebar"}
      >
        {isExpanded ? (
          <span className="text-2xl font-bold">&lt;</span>
        ) : (
          <span className="text-2xl font-bold">&gt;</span>
        )}
      </button>
      
      {/* Sidebar Content */}
      <div className={isExpanded ? "" : "hidden"}>
        <div className="mb-8 pl-2 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-2">CtrlWeb AMS</h2>
          <div className="text-sm">Apartment Management</div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href !== "#" &&
              (pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href)));

            // Dropdown for Quotations
            if (link.children) {
              const isDropdownOpen =
                openDropdown === link.label ||
                link.children.some((child) => pathname.startsWith(child.href));
              return (
                <div key={link.label}>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition w-full
                      ${
                        isDropdownOpen
                          ? "bg-white text-[#e41c24]"
                          : "bg-[#e41c24] text-white hover:bg-white hover:text-[#e41c24]"
                      }
                      justify-between
                    `}
                    style={{
                      fontWeight: isDropdownOpen ? "bold" : "normal",
                      boxShadow: isDropdownOpen ? "0 2px 8px #0001" : undefined,
                    }}
                    onClick={() => handleDropdown(link.label)}
                    type="button"
                  >
                    <span className="flex items-center gap-2">
                      {link.label}
                    </span>
                    {isDropdownOpen ? (
                      <FaChevronDown className="ml-2" />
                    ) : (
                      <FaChevronRight className="ml-2" />
                    )}
                  </button>
                  {/* Dropdown children */}
                  {isDropdownOpen && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {link.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link href={child.href} key={child.label}>
                            <button
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition w-full
                                ${
                                  isChildActive
                                    ? "bg-white text-[#e41c24]"
                                    : "bg-[#e41c24] text-white hover:bg-white hover:text-[#e41c24]"
                                }
                                justify-start
                              `}
                              style={{
                                fontWeight: isChildActive ? "bold" : "normal",
                                boxShadow: isChildActive ? "0 2px 8px #0001" : undefined,
                              }}
                              type="button"
                            >
                              {child.icon}
                              {child.label}
                            </button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular links
            return (
              <Link href={link.href} key={link.label}>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition
                    ${
                      isActive
                        ? "bg-white text-[#e41c24]"
                        : "bg-[#e41c24] text-white hover:bg-white hover:text-[#e41c24]"
                    }
                    justify-start
                  `}
                  style={{
                    fontWeight: isActive ? "bold" : "normal",
                    boxShadow: isActive ? "0 2px 8px #0001" : undefined,
                  }}
                  title={link.label}
                  type="button"
                >
                  {link.label}
                </button>
              </Link>
            );
          })}
          
          {/* Settings Section */}
          <div className="mt-4 border-t border-white/20 pt-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition w-full
                ${
                  showSettings
                    ? "bg-white text-[#e41c24]"
                    : "bg-[#e41c24] text-white hover:bg-white hover:text-[#e41c24]"
                }
                justify-between
              `}
              style={{
                fontWeight: showSettings ? "bold" : "normal",
                boxShadow: showSettings ? "0 2px 8px #0001" : undefined,
              }}
              onClick={() => handleDropdown("Settings")}
              type="button"
            >
              <span className="flex items-center gap-2">
                <FaCog />
                Settings
              </span>
              {showSettings ? (
                <FaChevronDown className="ml-2" />
              ) : (
                <FaChevronRight className="ml-2" />
              )}
            </button>
            
            {/* Settings Dropdown */}
            {showSettings && (
              <div className="ml-4 mt-1 flex flex-col gap-1">
                {/* Dark Mode Toggle - FIXED THE LABELS! */}
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition w-full bg-[#e41c24] text-white hover:bg-white hover:text-[#e41c24] justify-start"
                  onClick={toggleDarkMode}
                  type="button"
                >
                  {isDarkMode ? <FaSun /> : <FaMoon />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                
                {/* Logout Button */}
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition w-full bg-[#e41c24] text-white hover:bg-white hover:text-[#e41c24] justify-start"
                  onClick={handleLogout}
                  type="button"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
        
        <div className="mt-8 text-xs text-[#fff8] pl-2 transition-all duration-300">
          © 2025 CtrlWeb
        </div>
      </div>
    </aside>
  );
}