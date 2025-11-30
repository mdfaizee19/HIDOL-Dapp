"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

type UserType = {
  id: string;
  name: string;
  loanAmount: number;
  interest: number;
  badge: "happy" | "neutral" | "sad";
};

// dummy borrower data
const users: UserType[] = [
  { id: "LN1001", name: "Azeem", loanAmount: 1200, interest: 18, badge: "happy" },
  { id: "LN1002", name: "Jon", loanAmount: 800, interest: 12, badge: "neutral" },
  { id: "LN1003", name: "Ravi", loanAmount: 300, interest: 6, badge: "sad" },
  { id: "LN1004", name: "madhesh", loanAmount: 1200, interest: 18, badge: "happy" },
  { id: "LN1005", name: "faizee", loanAmount: 800, interest: 12, badge: "neutral" },
  { id: "LN1006", name: "Ravi", loanAmount: 300, interest: 6, badge: "sad" },
  { id: "LN1007", name: "hari", loanAmount: 1200, interest: 18, badge: "happy" },
  { id: "LN1008", name: "haroon", loanAmount: 800, interest: 12, badge: "neutral" },
  { id: "LN1009", name: "Ravi", loanAmount: 300, interest: 6, badge: "sad" },
];

export default function VerifiedPage() {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const badgeImg = {
    happy: "/badges/happy.jpg",
    neutral: "/badges/neutral.jpg",
    sad: "/badges/sad.jpg",
  };

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-bold mb-4 text-white">Verified Borrowers</h2>
      <p className="text-gray-300 mb-6">Borrowers verified using ZK Proofs. Badge depends on loan interest rate.</p>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => setSelectedUser(u)}   // <-- open popup on click
            className="flex justify-between items-center px-6 py-4 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition"
          >
            <div>
              <p className="text-white font-semibold text-lg">{u.name}</p>
              <p className="text-gray-400 text-sm">Loan ID: {u.id}</p>
              <p className="text-gray-400 text-sm">
                Loan: {u.loanAmount} ADA • Interest: {u.interest}%
              </p>
            </div>
            <img
              src={badgeImg[u.badge]}
              alt={u.badge}
              className="w-14 h-14 object-cover rounded-full border-2 border-white"
            />
          </div>
        ))}
      </div>

      {/* Overlay Popup */}
      {selectedUser && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50">
          <div className="w-[450px] bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-3">
              {selectedUser.name}
            </h3>

            <p className="text-gray-400 mb-1">Loan ID: {selectedUser.id}</p>
            <p className="text-gray-400 mb-1">
              Loan Amount: {selectedUser.loanAmount} ADA
            </p>
            <p className="text-gray-400 mb-4">
              Interest: {selectedUser.interest}%
            </p>

            <img
              src={badgeImg[selectedUser.badge]}
              alt="badge"
              className="w-20 h-20 mx-auto mb-5 object-cover rounded-full border-2 border-white"
            />

            {/* Lock Collateral Button */}
            <button
              onClick={() => alert("Lock contract clicked (later connect to smart contract)")}
              className="w-full bg-white text-black font-semibold px-5 py-3 rounded-md hover:bg-gray-200 transition"
            >
              Lock Collateral
            </button>

            {/* Close */}
            <button
              onClick={() => setSelectedUser(null)}
              className="w-full mt-3 text-sm text-gray-400 hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
