"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import WalletModal from "./WalletModal";
import { useWallet } from "@meshsdk/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { connected, connect } = useWallet();

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-900/50 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-emerald-400">Dashboard</h2>

          <button
            onClick={async () => {
              if (!connected) {
                if ((window as any).cardano?.lace) {
                  await connect("lace");
                } else {
                  setIsWalletModalOpen(true);
                }
              }
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${connected
              ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
          >
            {connected ? "Wallet Connected" : "Connect Wallet"}
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>

      {isWalletModalOpen && (
        <WalletModal onClose={() => setIsWalletModalOpen(false)} />
      )}
    </div>
  );
}
