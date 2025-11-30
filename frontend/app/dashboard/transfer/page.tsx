import DashboardLayout from "@/components/DashboardLayout";

export default function TransferPage() {
    return (
        <DashboardLayout>
            <h2 className="text-3xl font-bold mb-4 text-white">Transfer Crypto</h2>
            <p className="text-gray-300 mb-6">Move funds between your own Cardano accounts.</p>

            <div className="flex flex-col gap-4 w-96">
                <input className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white" placeholder="From Account" />
                <input className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white" placeholder="To Account" />
                <input className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white" placeholder="Amount" />
                <button className="px-6 py-3 bg-yellow-600 rounded font-semibold hover:bg-yellow-700 text-white transition">
                    Transfer
                </button>
            </div>
        </DashboardLayout>
    );
}
