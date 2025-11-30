"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import WalletModal from "@/components/WalletModal";
import { useApp } from "@/context/AppContext";

export default function HomePage() {
    const router = useRouter();
    const [showWalletModal, setShowWalletModal] = useState(false);
    const { setState } = useApp();

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#021b0f]"
            style={{ fontFamily: "serif" }}
        >
            {/* Title */}
            <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight text-emerald-400 drop-shadow-xl">
                Cardano Up
            </h1>

            {/* Tagline */}
            <h2 className="text-3xl md:text-5xl font-bold mt-8 leading-tight italic text-emerald-200">
                Borrow Without Banks.
                <br />
                Verify Without Identity.
            </h2>

            {/* Description */}
            <p className="text-emerald-100 text-lg md:text-xl mt-8 max-w-3xl mx-auto leading-relaxed opacity-90 italic">
                Cardano Up is a zero-knowledge lending protocol that allows users to prove financial
                credibility without exposing identity, salary, documents, or credit score.
                <br />No banks. No KYC. No leaks — only math.
            </p>

            {/* Buttons */}
            <div className="flex gap-6 mt-14">
                <button
                    onClick={() => setShowWalletModal(true)}
                    className="px-10 py-4 text-xl font-bold rounded-xl bg-white text-black shadow-lg hover:scale-105 transition-all"
                >
                    Connect Wallet
                </button>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="px-10 py-4 text-xl font-bold rounded-xl bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 hover:scale-105 transition-all"
                >
                    Enter App
                </button>
            </div>

            {showWalletModal && (
                <WalletModal
                    onSelect={async (wallet: string) => {
                        setState(prev => ({ ...prev, loading: true }));
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        setShowWalletModal(false);
                        setState(prev => ({ ...prev, loading: false }));
                        router.push("/dashboard");
                    }}
                    onClose={() => setShowWalletModal(false)}
                />
            )}
        </div>
    );
}
