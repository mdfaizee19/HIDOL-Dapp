import { useWalletList, useWallet } from "@meshsdk/react";

export default function WalletModal({ onClose }: { onClose: () => void }) {
    const wallets = useWalletList();
    const { connect } = useWallet();

    const selectWallet = async (id: string) => {
        await connect(id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-96 space-y-3">
                <h2 className="text-center text-xl font-semibold text-gray-900 dark:text-white">Select Wallet</h2>

                {wallets.length === 0 && (
                    <p className="text-center text-gray-400">
                        No wallets detected. Install Lace, Eternl, Nami, Flint, Typhon or Gero.
                    </p>
                )}

                {wallets.map((w) => (
                    <button
                        key={w.id}
                        onClick={() => selectWallet(w.id)}
                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-900 dark:text-white flex items-center gap-3"
                    >
                        <img src={w.icon} alt={w.name} className="w-6 h-6" />
                        <span className="font-medium">{w.name}</span>
                    </button>
                ))}

                <button
                    onClick={onClose}
                    className="w-full mt-4 text-sm text-gray-500 hover:underline"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
