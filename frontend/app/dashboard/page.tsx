"use client";
import DashboardLayout from '@/components/DashboardLayout';
import Image from "next/image";
import { Playfair_Display } from 'next/font/google';
import { useState } from "react";

const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'] });

export default function DashboardHome() {
    const [isWhyUsOpen, setIsWhyUsOpen] = useState(false);

    return (
        <DashboardLayout>
            <div className={`relative min-h-screen px-10 py-12 text-center overflow-hidden ${playfair.className}`} style={{ fontFamily: "serif" }}>
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/sky.jpg"
                        alt="Dashboard Background"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-emerald-900/40 mix-blend-multiply z-10" />
                    <div className="absolute inset-0 bg-black/20 z-10" />
                </div>

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full mt-20">
                    <h2 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg mb-6 italic tracking-tight">
                        Dashboard
                    </h2>

                    <p className="text-2xl md:text-3xl text-emerald-200 opacity-90 mt-2 italic font-light max-w-2xl">
                        Choose an action from the sidebar to begin.
                    </p>

                    <div className="mt-14 text-emerald-100 text-xl opacity-90 max-w-3xl leading-relaxed font-light">
                        <p>Borrow, Lend, Send, Transfer, Receive, Stake or Verify via ZK proof — all without revealing identity.</p>
                        <p className="mt-4 text-white font-normal">Your wallet is your passport. Privacy is the default.</p>
                    </div>

                    {/* Why Us Button */}
                    <button
                        onClick={() => setIsWhyUsOpen(true)}
                        className="mt-12 text-white/80 hover:text-white underline decoration-emerald-400/50 hover:decoration-emerald-400 underline-offset-4 transition-all text-lg"
                    >
                        Why Us?
                    </button>
                </div>

                {/* Why Us Modal */}
                {isWhyUsOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
                        <div className="relative bg-[#0a1f16] border border-emerald-500/30 rounded-2xl max-w-3xl w-full p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <button
                                onClick={() => setIsWhyUsOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h3 className={`${playfair.className} text-4xl font-bold text-emerald-400 mb-6 italic`}>Why Us</h3>

                            <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-light font-sans">
                                <p>
                                    HIDOL is built on the belief that financial access should not require financial exposure. While traditional lenders demand identity, credit history, and income documents, our protocol uses zero-knowledge proofs so borrowers can prove financial credibility without disclosing personal information. We eliminate discrimination, surveillance, and data vulnerability without compromising lender safety.
                                </p>
                                <p>
                                    Our system replaces trust in institutions with verifiable mathematics. Collateral, attestations, and market-driven rates make lending fair and transparent, while privacy remains non-negotiable. By combining zero-knowledge proofs, Cardano settlement, and instant execution through Hydra, HIDOL delivers private, fast, and globally accessible lending.
                                </p>
                                <p>
                                    HIDOL is designed for people who deserve access to capital without sacrificing their privacy, and for lenders who want yield without absorbing unnecessary risk.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
