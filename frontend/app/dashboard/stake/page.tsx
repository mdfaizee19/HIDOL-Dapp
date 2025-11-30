import DashboardLayout from "@/components/DashboardLayout";

export default function StakePage() {
    return (
        <DashboardLayout>
            <h2 className="text-3xl font-bold mb-4 text-white">Stake Crypto</h2>
            <p className="text-gray-300 mb-6">Delegate your ADA and start earning passive rewards.</p>

            <div className="flex flex-col gap-4 w-96">
                <input className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white" placeholder="Select Pool ID" />
                <input className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white" placeholder="Amount to Stake" />
                <button className="px-6 py-3 bg-indigo-600 rounded font-semibold hover:bg-indigo-700 text-white transition">
                    Stake
                </button>
            </div>
        </DashboardLayout>
    );
}
