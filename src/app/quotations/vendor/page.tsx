"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

// Dummy roles and user (for demo)
const currentUser = { name: "Estate Manager", role: "Estate Manager" }; // Change role to "President" to see approval flow

// Dummy data for quotations
const initialQuotations = [
  {
    id: 1,
    vendor: "ABC Corp",
    purpose: "Painting Block A",
    amount: 12000,
    file: "abc-quote.pdf",
    status: "Pending",
    uploadedBy: "Estate Manager",
    date: "2025-06-02",
  },
  {
    id: 2,
    vendor: "XYZ Pvt Ltd",
    purpose: "Painting Block A",
    amount: 9500,
    file: "xyz-quote.pdf",
    status: "Pending",
    uploadedBy: "Estate Manager",
    date: "2025-06-02",
  },
  {
    id: 3,
    vendor: "HomeFix",
    purpose: "Painting Block A",
    amount: 15000,
    file: "homefix-quote.pdf",
    status: "Pending",
    uploadedBy: "Estate Manager",
    date: "2025-06-02",
  },
];

const MC_ROLES = [
  "President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Joint Treasurer",
];

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState(initialQuotations);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    vendor: "",
    purpose: "",
    amount: "",
    file: null as File | null,
  });
  const [approvals, setApprovals] = useState<string[]>([]);
  const [decision, setDecision] = useState<{ date: string; approvers: string[]; reason: string } | null>(null);
  const [reason, setReason] = useState("");

  // Simulate MC user for demo
  const isMC = MC_ROLES.includes(currentUser.role);

  // Check if approval is needed
  const needsApproval = quotations.some(q => q.amount > 5000);

  // Approval can happen only if all MC roles have agreed
  const canApprove = MC_ROLES.every(role => approvals.includes(role));

  // Handlers
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setQuotations([
      ...quotations,
      {
        id: quotations.length + 1,
        vendor: uploadForm.vendor,
        purpose: uploadForm.purpose,
        amount: Number(uploadForm.amount),
        file: uploadForm.file ? uploadForm.file.name : "",
        status: "Pending",
        uploadedBy: currentUser.name,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setShowUpload(false);
    setUploadForm({ vendor: "", purpose: "", amount: "", file: null });
  };

  const handleApprove = () => {
    setDecision({
      date: new Date().toISOString().slice(0, 10),
      approvers: approvals,
      reason,
    });
    setQuotations(quotations.map(q => ({ ...q, status: "Approved" })));
  };

  // MC member approval simulation
  const handleMCApproval = (role: string) => {
    if (!approvals.includes(role)) {
      setApprovals([...approvals, role]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e9f2] flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-[#222]">Quotations (RFQ)</h1>
          {["Estate Manager", ...MC_ROLES].includes(currentUser.role) && (
            <button
              className="bg-[#e41c24] text-white px-4 py-2 rounded font-semibold hover:bg-[#b81a1f] transition"
              onClick={() => setShowUpload(true)}
            >
              + Upload Quotation
            </button>
          )}
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-[#222]">Upload Quotation</h2>
              <form
                onSubmit={handleUpload}
                className="flex flex-col gap-4"
              >
                <input
                  type="text"
                  placeholder="Vendor Name"
                  value={uploadForm.vendor}
                  onChange={e => setUploadForm(f => ({ ...f, vendor: e.target.value }))}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Purpose"
                  value={uploadForm.purpose}
                  onChange={e => setUploadForm(f => ({ ...f, purpose: e.target.value }))}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={uploadForm.amount}
                  onChange={e => setUploadForm(f => ({ ...f, amount: e.target.value }))}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white"
                  required
                  min={1}
                />
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setUploadForm(f => ({ ...f, file: e.target.files?.[0] ?? null }))}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] bg-white"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-[#8882] text-[#222] font-semibold hover:bg-[#e41c24]/10 transition"
                    onClick={() => setShowUpload(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#e41c24] text-white font-semibold hover:bg-[#b81a1f] transition"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quotations Table */}
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <div className="mb-2 font-semibold text-[#222]">Uploaded Quotations</div>
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-[#222] font-semibold border-b">
                <th className="py-2 px-2">Vendor</th>
                <th className="py-2 px-2">Purpose</th>
                <th className="py-2 px-2">Amount</th>
                <th className="py-2 px-2">File</th>
                <th className="py-2 px-2">Uploaded By</th>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {quotations.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-[#888]">
                    No quotations uploaded.
                  </td>
                </tr>
              )}
              {quotations.map((q) => (
                <tr key={q.id} className="border-b last:border-b-0 hover:bg-[#f5e9f2] transition">
                  <td className="py-2 px-2 font-medium text-black">{q.vendor}</td>
                  <td className="py-2 px-2 text-black">{q.purpose}</td>
                  <td className="py-2 px-2 text-black">₹{q.amount.toLocaleString()}</td>
                  <td className="py-2 px-2 text-black">
                    {q.file ? (
                      <a
                        href="#"
                        className="text-[#e41c24] underline"
                        title="Download"
                        onClick={e => e.preventDefault()}
                      >
                        {q.file}
                      </a>
                    ) : (
                      <span className="text-[#888]">No file</span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-black">{q.uploadedBy}</td>
                  <td className="py-2 px-2 text-black">{q.date}</td>
                  <td className="py-2 px-2 text-black">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        q.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-[#e41c24]/10 text-[#e41c24]"
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Approval Workflow */}
        {needsApproval && (
          <div className="bg-white rounded-xl shadow p-6 mt-8">
            <div className="font-bold text-[#222] mb-6">Approval Workflow</div>
            <div className="flex flex-wrap gap-4 mb-4">
              {MC_ROLES.map((role) => (
                <div key={role} className="flex items-center gap-2">
                  <span className="font-semibold text-black">{role}</span>
                  <button
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      approvals.includes(role)
                        ? "bg-green-100 text-green-700"
                        : "bg-[#e41c24] text-white hover:bg-[#b81a1f]"
                    }`}
                    disabled={approvals.includes(role) || !isMC || currentUser.role !== role}
                    onClick={() => handleMCApproval(role)}
                  >
                    {approvals.includes(role) ? "Agreed" : "Agree"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Reason for approval (required)"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e41c24] text-[#222] bg-white w-full max-w-md"
                required
              />
            </div>
            <button
              className={`px-6 py-2 rounded font-semibold transition ${
                canApprove && reason
                  ? "bg-[#e41c24] text-white hover:bg-[#b81a1f]"
                  : "bg-[#8884] text-white cursor-not-allowed"
              }`}
              disabled={!canApprove || !reason}
              onClick={handleApprove}
            >
              Approve
            </button>
            {decision && (
              <div className="mt-6 text-sm text-[#222]">
                <div>
                  <span className="font-semibold">Decision Date:</span> {decision.date}
                </div>
                <div>
                  <span className="font-semibold">Approvers:</span> {decision.approvers.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Reason:</span> {decision.reason}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}