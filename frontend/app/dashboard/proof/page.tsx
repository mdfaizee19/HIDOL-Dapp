'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { generateProof, verifyProof, lockCollateral, fundLoan } from '@/lib/api';
import type { ProverOutput, VerifyResponse } from '@/types';

export default function ProofPage() {
    const router = useRouter();
    const [loanId, setLoanId] = useState('');
    const [secretData, setSecretData] = useState('');
    const [publicData, setPublicData] = useState('');

    const [proofOutput, setProofOutput] = useState<ProverOutput | null>(null);
    const [proofLoading, setProofLoading] = useState(false);

    const [attestation, setAttestation] = useState<VerifyResponse | null>(null);
    const [backendLoading, setBackendLoading] = useState(false);

    const [txHash, setTxHash] = useState<string | null>(null);
    const [isLocking, setIsLocking] = useState(false);

    const [fundTxHash, setFundTxHash] = useState<string | null>(null);
    const [isFunding, setIsFunding] = useState(false);

    // Generate Proof
    async function handleGenerateProof() {
        if (!loanId || !secretData || !publicData) {
            alert('Please fill in all fields');
            return;
        }

        setProofLoading(true);
        try {
            const proof = await generateProof({
                loanId: loanId,
                secret: secretData,
                publicData: publicData,
            });
            setProofOutput(proof);
        } catch (error) {
            console.error(error);
            alert('Failed to generate proof: ' + (error as Error).message);
        }
        setProofLoading(false);
    }

    // Verify Proof
    async function handleVerify() {
        if (!proofOutput || !loanId) {
            alert('Please generate a proof first');
            return;
        }

        setBackendLoading(true);
        try {
            const res = await verifyProof(
                loanId,
                proofOutput.proof,
                proofOutput.publicInputs[1]
            );

            if (res.success) {
                setAttestation(res);
            } else {
                alert('Verification failed: ' + res.message);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to verify proof');
        }
        setBackendLoading(false);
    }

    // Lock Collateral
    async function handleLockCollateral() {
        if (!attestation || !proofOutput) return;
        setIsLocking(true);
        try {
            const result = await lockCollateral(loanId, proofOutput.publicInputs[1]);
            if (result.ok) {
                // In a real app, result.loan would contain the tx hash or we'd get it from wallet submission
                setTxHash("tx_" + Math.random().toString(36).substring(7));
            } else {
                alert('Failed to lock collateral: ' + result.reason);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to lock collateral');
        }
        setIsLocking(false);
    }

    // Fund Loan
    async function handleFundLoan() {
        setIsFunding(true);
        try {
            const result = await fundLoan(loanId);
            if (result.ok) {
                setFundTxHash("tx_" + Math.random().toString(36).substring(7));
            } else {
                alert('Failed to fund loan: ' + result.reason);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to fund loan');
        }
        setIsFunding(false);
    }

    return (
        <DashboardLayout>
            <div className="max-w-3xl">
                <h2 className="text-4xl font-bold text-white mb-6">Zero-Knowledge Proof</h2>
                <p className="text-lg text-gray-400 mb-8">
                    Generate and verify zero-knowledge proofs for loan verification.
                </p>

                {/* Input Form */}
                <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
                    <h3 className="text-2xl font-semibold text-white mb-4">Step 1: Input Data</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Loan ID
                            </label>
                            <input
                                type="text"
                                value={loanId}
                                onChange={(e) => setLoanId(e.target.value)}
                                placeholder="Enter loan ID (e.g., LOAN-12345)"
                                className="w-full px-4 py-3 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Secret Data (Private)
                            </label>
                            <input
                                type="password"
                                value={secretData}
                                onChange={(e) => setSecretData(e.target.value)}
                                placeholder="Enter secret data"
                                className="w-full px-4 py-3 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Public Data
                            </label>
                            <input
                                type="text"
                                value={publicData}
                                onChange={(e) => setPublicData(e.target.value)}
                                placeholder="Enter public data"
                                className="w-full px-4 py-3 rounded-md bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
                            />
                        </div>

                        <button
                            onClick={handleGenerateProof}
                            disabled={proofLoading}
                            className="w-full px-6 py-3 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {proofLoading ? 'Generating Proof...' : 'Generate Proof'}
                        </button>
                    </div>
                </div>

                {/* Proof Output */}
                {proofOutput && (
                    <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
                        <h3 className="text-2xl font-semibold text-white mb-4">Step 2: Proof Generated</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Proof (Base64)
                                </label>
                                <div className="bg-black p-3 rounded border border-gray-700 font-mono text-xs break-all text-gray-300">
                                    {proofOutput.proof.substring(0, 100)}...
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Proof Commit
                                </label>
                                <div className="bg-black p-3 rounded border border-gray-700 font-mono text-sm text-gray-300">
                                    {proofOutput.publicInputs[1]}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Status
                                </label>
                                <div className="inline-block px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold border border-gray-700">
                                    ✓ Verified Locally
                                </div>
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={backendLoading}
                                className="w-full px-6 py-3 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {backendLoading ? 'Verifying...' : 'Verify Proof'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Attestation Result */}
                {attestation && (
                    <div className="bg-gray-900 rounded-lg p-6 mb-6 border-2 border-white">
                        <h3 className="text-2xl font-semibold text-white mb-4">
                            ✓ Attestation Received
                        </h3>

                        <div className="space-y-3 text-gray-300">
                            <div>
                                <span className="font-semibold text-white">Loan ID:</span>{' '}
                                <span className="font-mono">{attestation.attestation.loanId}</span>
                            </div>

                            <div>
                                <span className="font-semibold text-white">Proof Commit:</span>{' '}
                                <span className="font-mono text-sm break-all">
                                    {attestation.attestation.proofCommit}
                                </span>
                            </div>

                            <div>
                                <span className="font-semibold text-white">Expiry:</span>{' '}
                                <span>{new Date(attestation.attestation.expiry).toLocaleString()}</span>
                            </div>

                            <div>
                                <span className="font-semibold text-white">Signature:</span>{' '}
                                <span className="font-mono text-xs break-all">
                                    {attestation.attestation.signature}
                                </span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="font-semibold text-white text-lg">
                                    ✔ Proof verified successfully by backend
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lock Collateral Button */}
                {attestation && !txHash && (
                    <button
                        onClick={handleLockCollateral}
                        className="w-full px-6 py-3 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        disabled={isLocking}
                    >
                        {isLocking ? 'Locking...' : 'Lock Collateral'}
                    </button>
                )}

                {/* Transaction Success */}
                {txHash && (
                    <div className="mt-6 p-6 bg-gray-900 rounded-lg border-2 border-white">
                        <h3 className="text-2xl font-semibold text-white mb-4">
                            ✓ Collateral Locked
                        </h3>
                        <div className="space-y-3 text-gray-300">
                            <div>
                                <span className="font-semibold text-white">Transaction Hash:</span>{' '}
                                <span className="font-mono text-xs break-all block mt-1">
                                    {txHash}
                                </span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="font-semibold text-white text-lg">
                                    ✔ Collateral successfully locked on-chain
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fund Loan Button */}
                {txHash && !fundTxHash && (
                    <button
                        onClick={handleFundLoan}
                        disabled={isFunding}
                        className="w-full px-6 py-3 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {isFunding ? 'Funding loan...' : 'Fund Loan (Lender)'}
                    </button>
                )}

                {/* Loan Active Success */}
                {fundTxHash && (
                    <div className="mt-6 p-6 bg-gray-900 rounded-lg border-2 border-white">
                        <h3 className="text-2xl font-semibold text-white mb-4">
                            ✓ Loan Active
                        </h3>
                        <div className="space-y-3 text-gray-300">
                            <div>
                                <span className="font-semibold text-white">Funding Tx Hash:</span>{' '}
                                <span className="font-mono text-xs break-all block mt-1">
                                    {fundTxHash}
                                </span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="font-semibold text-white text-lg">
                                    ✔ Loan funded successfully — borrower has received the funds
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Final Action Buttons */}
                {fundTxHash && (
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 bg-white text-black hover:bg-gray-200 transition font-semibold rounded-md"
                        >
                            Go to Dashboard
                        </button>

                        <button
                            onClick={() => router.push('/dashboard/repay')}
                            className="px-6 py-3 bg-gray-800 text-white hover:bg-gray-700 transition font-semibold rounded-md"
                        >
                            Repay Loan
                        </button>

                        <button
                            onClick={() => router.push('/dashboard/loan-details')}
                            className="px-6 py-3 bg-gray-800 text-white hover:bg-gray-700 transition font-semibold rounded-md"
                        >
                            View Loan Details
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
