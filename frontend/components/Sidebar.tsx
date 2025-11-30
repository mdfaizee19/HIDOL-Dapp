'use client';

import { useRouter } from 'next/navigation';

const menu = [
    { label: 'Borrow', path: '/dashboard/buy', tooltip: "Request a loan privately using ZK proofs" },
    { label: 'Lend', path: '/dashboard/sell', tooltip: "Earn safe yield by funding verified borrowers" },
    { label: 'Send', path: '/dashboard/send', tooltip: "Send ADA or tokens to another wallet" },
    { label: 'Transfer', path: '/dashboard/transfer', tooltip: "Move funds between your accounts" },
    { label: 'Receive', path: '/dashboard/receive', tooltip: "Get your wallet address to receive funds" },
    { label: 'Stake', path: '/dashboard/stake', tooltip: "" },
    { label: 'Proof', path: '/dashboard/proof', tooltip: "" },
];

export default function Sidebar() {
    const router = useRouter();

    return (
        <div className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col p-6 transition-colors duration-300">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10 tracking-tight">
                Cardano Up
            </h1>

            <nav className="flex flex-col gap-4">
                {menu.map((item) => (
                    <div key={item.path} className="relative group w-full">
                        <button
                            onClick={() => router.push(item.path)}
                            className="w-full text-left text-lg font-medium text-gray-700 dark:text-white hover:text-emerald-600 dark:hover:text-gray-300 hover:translate-x-1 transition duration-200"
                        >
                            {item.label}
                        </button>
                        {item.tooltip && (
                            <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded bg-emerald-700 text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 pointer-events-none">
                                {item.tooltip}
                            </span>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
}
