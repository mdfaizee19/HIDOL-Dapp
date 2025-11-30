"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

export default function SellPage() {
    const { setState } = useApp();
    const [token, setToken] = useState("");
    const [amount, setAmount] = useState("");

    const handleSell = async () => {
        // show loading screen
        setState(prev => ({ ...prev, loading: true }));

        // fake delay for now — backend will be connected later
        await new Promise(resolve => setTimeout(resolve, 2000));

        // hide loading screen
        setState(prev => ({ ...prev, loading: false }));

        alert("Sell request sent! (Backend will be added later)");
    };

    return (
        <DashboardLayout>
            <h2 className="text-3xl font-bold mb-4 text-white">Lend Crypto</h2>
            <p className="text-gray-300 mb-6">Choose a token and enter how much you want to sell.</p>

            <div className="flex flex-col gap-4 w-80">
                <input
                    className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white"
                    placeholder="Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />

                <input
                    className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <button
                    onClick={handleSell}
                    className="px-6 py-3 bg-red-600 rounded font-semibold hover:bg-red-700 text-white transition"
                >
                    Lend
                </button>
            </div>
        </DashboardLayout>
    );
}
