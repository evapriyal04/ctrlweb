"use client";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { FaTools, FaCheckCircle, FaTrash, FaHistory, FaWhatsapp } from "react-icons/fa";

type Asset = {
  id: number;
  serial: string;
  name: string;
  category: string;
  status: "Active" | "Under Repair" | "Disposed";
  purchaseDate: string;
  lastRepair?: string;
  disposalDate?: string;
  repairApproval?: boolean;
  repairRequestedBy?: string;
};

const initialAssets: Asset[] = [
  {
    id: 1,
    serial: "AS-0001",
    name: "Lift Motor",
    category: "Machinery",
    status: "Active",
    purchaseDate: "2023-01-15",
  },
  {
    id: 2,
    serial: "AS-0002",
    name: "Generator",
    category: "Machinery",
    status: "Under Repair",
    purchaseDate: "2022-08-10",
    lastRepair: "2025-05-30",
    repairApproval: false,
    repairRequestedBy: "Estate Manager",
  },
  {
    id: 3,
    serial: "AS-0003",
    name: "Clubhouse Sofa",
    category: "Furniture",
    status: "Disposed",
    purchaseDate: "2021-03-12",
    disposalDate: "2025-04-01",
  },
  {
    id: 4,
    serial: "AS-0004",
    name: "Swimming Pool Pump",
    category: "Machinery",
    status: "Active",
    purchaseDate: "2024-02-20",
  },
];

const statusColors = {
  Active: "text-green-600 bg-green-100",
  "Under Repair": "text-[#e41c24] bg-red-100",
  Disposed: "text-gray-500 bg-gray-100",
};

const approvalRoles = [
  "President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Joint Treasurer",
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [search, setSearch] = useState("");
  const [showApproval, setShowApproval] = useState<null | number>(null);
  const [approvals, setApprovals] = useState<{ [key: number]: string[] }>({});

  // Filter assets
  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.serial.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  // Simulate WhatsApp notification
  const sendWhatsApp = (asset: Asset) => {
    alert(
      `WhatsApp notification sent for exit approval of asset: ${asset.name} (${asset.serial})`
    );
  };

  // Handle approval
  const handleApprove = (assetId: number, role: string) => {
    setApprovals((prev) => {
      const updated = { ...prev };
      if (!updated[assetId]) updated[assetId] = [];
      if (!updated[assetId].includes(role)) updated[assetId].push(role);
      // If all roles approved, update asset status
      if (
        updated[assetId].length === approvalRoles.length
      ) {
        setAssets((prevAssets) =>
          prevAssets.map((a) =>
            a.id === assetId
              ? { ...a, repairApproval: true, status: "Under Repair" }
              : a
          )
        );
        setShowApproval(null);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#f5e9f2] flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[#222] mb-6">Assets & Liabilities Management</h1>
        {/* Actions & Search */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <input
            type="text"
            placeholder="Search by name, serial, or category"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
          />
          <button
            className="bg-[#22223b] text-white px-6 py-2 rounded font-semibold hover:bg-[#444] transition"
            // onClick={...} // Add asset modal
          >
            + Add Asset
          </button>
        </div>
        {/* Asset Table */}
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-[#222] font-semibold border-b">
                <th className="py-2 px-2">#</th>
                <th className="py-2 px-2">Serial No.</th>
                <th className="py-2 px-2">Asset Name</th>
                <th className="py-2 px-2">Category</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Purchase Date</th>
                <th className="py-2 px-2">Last Repair</th>
                <th className="py-2 px-2">Disposal Date</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-[#888]">
                    No assets found.
                  </td>
                </tr>
              )}
              {filteredAssets.map((asset, i) => (
                <tr
                  key={asset.id}
                  className="border-b last:border-b-0 hover:bg-[#f5e9f2] transition"
                >
                  <td className="py-2 px-2 text-black">{i + 1}</td>
                  <td className="py-2 px-2 text-black font-mono">{asset.serial}</td>
                  <td className="py-2 px-2 text-black">{asset.name}</td>
                  <td className="py-2 px-2 text-black">{asset.category}</td>
                  <td className="py-2 px-2 text-black">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[asset.status]}`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-black">{asset.purchaseDate}</td>
                  <td className="py-2 px-2 text-black">{asset.lastRepair || "-"}</td>
                  <td className="py-2 px-2 text-black">{asset.disposalDate || "-"}</td>
                  <td className="py-2 px-2 flex gap-2">
                    {asset.status === "Active" && (
                      <button
                        className="bg-[#e41c24] text-white px-3 py-1 rounded font-semibold hover:bg-[#b81a1f] transition text-xs flex items-center gap-1"
                        onClick={() => setShowApproval(asset.id)}
                        title="Send for Repair"
                      >
                        <FaTools /> Repair
                      </button>
                    )}
                    {asset.status === "Under Repair" && (
                      <>
                        <span className="text-[#e41c24] font-semibold text-xs flex items-center gap-1">
                          <FaHistory /> Awaiting Approval
                        </span>
                        <button
                          className="bg-[#25D366] text-white px-2 py-1 rounded font-semibold hover:bg-[#128C7E] transition text-xs flex items-center gap-1"
                          onClick={() => sendWhatsApp(asset)}
                          title="Send WhatsApp Notification"
                        >
                          <FaWhatsapp /> WhatsApp
                        </button>
                      </>
                    )}
                    {asset.status === "Disposed" && (
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <FaTrash /> Disposed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Approval Modal */}
        {showApproval && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-[#22223b]">Exit Approval Required</h2>
              <p className="mb-4 text-[#444]">
                Approval required from all admins for asset exit (repair):<br />
                <span className="font-semibold text-[#e41c24]">
                  {approvalRoles.join(", ")}
                </span>
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {approvalRoles.map((role) => (
                  <button
                    key={role}
                    className={`px-3 py-1 rounded font-semibold text-xs ${
                      approvals[showApproval]?.includes(role)
                        ? "bg-green-100 text-green-700 border border-green-400"
                        : "bg-[#f5e9f2] text-[#22223b] border border-[#e41c24] hover:bg-[#e41c24] hover:text-white"
                    }`}
                    onClick={() => handleApprove(showApproval, role)}
                    disabled={approvals[showApproval]?.includes(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <button
                className="mt-2 px-4 py-2 rounded bg-[#22223b] text-white font-semibold hover:bg-[#444] transition"
                onClick={() => setShowApproval(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}