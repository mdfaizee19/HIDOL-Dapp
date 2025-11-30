import DashboardLayout from "@/components/DashboardLayout";

export default function ReceivePage() {
    return (
        <DashboardLayout>
            <h2 className="text-3xl font-bold mb-4 text-white">Receive Crypto</h2>
            <p className="text-gray-300 mb-6">Share your wallet address to receive payments.</p>

            <div className="bg-gray-800 p-4 rounded w-96 border border-gray-700">
                <p className="font-semibold mb-2 text-white">Your Wallet Address:</p>
                <p className="break-all text-blue-300 font-mono">addr1qxy...xyz_wallet_address_here</p>
            </div>

            <button className="mt-6 px-6 py-3 bg-blue-600 rounded font-semibold hover:bg-blue-700 text-white transition">
                Copy Address
            </button>
        </DashboardLayout>
    );
}
