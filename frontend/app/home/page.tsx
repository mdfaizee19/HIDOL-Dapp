"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'] });

export default function HomePage() {
    const router = useRouter();

    const [isWhyUsOpen, setIsWhyUsOpen] = useState(false);

    return (
        <div className="relative min-h-screen overflow-hidden bg-black text-white font-sans selection:bg-emerald-500 selection:text-white">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/sky.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                {/* Green/Dark overlay for text readability and tint */}
                <div className="absolute inset-0 bg-emerald-900/40 mix-blend-multiply z-10" />
                <div className="absolute inset-0 bg-black/20 z-10" />
            </div>

            {/* Content Container */}
            <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-center">

                {/* Main Heading */}
                <h1 className={`${playfair.className} text-8xl md:text-9xl font-bold mb-2 tracking-tight italic text-white drop-shadow-lg`}>
                    HIDOL
                </h1>

                {/* Subheading */}
                <h2 className={`${playfair.className} text-4xl md:text-6xl font-normal mb-8 text-white max-w-5xl leading-tight italic drop-shadow-md`}>
                    Borrow Without Banks. <br />
                    <span className="text-emerald-400">Verify Without Identity.</span>
                </h2>

                {/* Description */}
                <p className={`${playfair.className} max-w-3xl text-xl md:text-2xl mb-12 text-gray-100 leading-relaxed font-light`}>
                    HIDOL is a zero-knowledge lending protocol that lets users prove financial
                    credibility without revealing personal information. No KYC. No credit
                    score. No documents. Only math.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto items-center justify-center">
                    <button
                        className={`${playfair.className} px-10 py-4 bg-white text-emerald-900 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                    >
                        Connect Wallet
                    </button>

                    <button
                        onClick={() => router.push("/dashboard")}
                        className={`${playfair.className} px-10 py-4 bg-transparent border border-white/40 hover:bg-white/10 text-white rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm flex items-center gap-2`}
                    >
                        Enter App <span className="text-2xl">→</span>
                    </button>
                </div>

                {/* Why Us Button */}
                <button
                    onClick={() => setIsWhyUsOpen(true)}
                    className={`${playfair.className} mt-8 text-white/80 hover:text-white underline decoration-emerald-400/50 hover:decoration-emerald-400 underline-offset-4 transition-all text-lg`}
                >
                    Why Us?
                </button>

                {/* Stats / Trust Indicators */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 pt-10">
                    {[
                        { label: "Total Value Locked", value: "$12.4M" },
                        { label: "Loans Originated", value: "1,240+" },
                        { label: "Privacy Preserved", value: "100%" },
                        { label: "Network", value: "Cardano" },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
                            <span className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Us Modal */}
            {isWhyUsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
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

                        <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-light">
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
    );
}
