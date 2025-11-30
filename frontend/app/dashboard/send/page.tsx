import DashboardLayout from "@/components/DashboardLayout";

export default function SendPage() {
    return (
        <DashboardLayout>
            <h2 className="text-3xl font-bold mb-4 text-white">Send Crypto</h2>
            <p className="text-gray-300 mb-6">Transfer crypto to another wallet address.</p>

            <div className="flex flex-col gap-4 w-96">
                <input className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white" placeholder="Recipient Address" />
                <input className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white" placeholder="Token" />
                <input className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white" placeholder="Amount" />
                <button className="px-6 py-3 bg-green-600 rounded font-semibold hover:bg-green-700 text-white transition">
                    Send
                </button>
            </div>
        </DashboardLayout>
    );
}
