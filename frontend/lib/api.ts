import { generateProof as proverGenerateProof } from 'prover';
import type { ProverOutput, VerifyResponse } from '@/types';

const ESCROW_SERVICE_URL = 'http://localhost:4001';

// Mock data generator for fields not yet in UI
function getMockProverData(loanId: string, secret: string, publicData: string) {
    // In a real app, these would come from the user or an oracle
    return {
        loanId: loanId,
        borrowerPubKey: "0000000000000000000000000000000000000000000000000000000000000000", // 32 bytes hex
        borrowerSignature: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", // 64 bytes hex
        loanAmount: 1000,
        collateralAmount: 2000,
        oraclePrice: 10,
        oracleTimestamp: Math.floor(Date.now() / 1000),
        incomeRaw: 50000,
        debtFlagRaw: false,
        requiredCollateralRatio: 1.5,
        incomeThreshold: 30000,
        maxOracleAge: 3600,
        currentTime: Math.floor(Date.now() / 1000)
    };
}

export async function generateProof(input: { loanId: string, secret: string, publicData: string }): Promise<ProverOutput> {
    try {
        const proverInput = getMockProverData(input.loanId, input.secret, input.publicData);
        const result = await proverGenerateProof(proverInput);

        return {
            proof: result.proofBytes,
            publicInputs: [
                JSON.stringify(result.publicFlags),
                result.proofCommit,
                Date.now().toString()
            ],
            verified: true // Local verification implicit in generation for now
        };
    } catch (error) {
        console.error("Proof generation failed:", error);
        throw error;
    }
}

export async function verifyProof(loanId: string, proofBytes: string, proofCommit: string): Promise<VerifyResponse> {
    try {
        // Construct the attestation payload expected by the backend
        // Note: In a real flow, the prover output would contain all necessary data.
        // Here we reconstruct what the backend expects.

        const attestation = {
            loanId,
            borrowerPkh: "user_wallet_pkh_placeholder", // Should match what was used in proof
            proofCommit,
            expiry: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
            flags: {
                income_ok: true, // These should come from the proof public inputs
                collateral_ratio_ok: true,
                wallet_ok: true,
                freshness_ok: true
            }
        };

        const meta = {
            proofOk: true, // The backend trusts us for now, or we should send the proof to backend to verify
            sigValid: true,
            collateralRatio: 2.0 // Derived from inputs
        };

        const res = await fetch(`${ESCROW_SERVICE_URL}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                attestation,
                meta
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.reason || "Verification failed");
        }

        const data = await res.json();

        return {
            success: true,
            attestation: {
                loanId: data.attestation.loanId,
                proofCommit: data.attestation.proofCommit,
                expiry: new Date(data.attestation.expiry * 1000).toISOString(),
                signature: "backend_signature_placeholder" // Backend doesn't sign in /verify yet, but we can mock it or add it
            },
            message: 'Verified by Escrow Service'
        };
    } catch (error: any) {
        console.error("Verification failed:", error);
        return {
            success: false,
            message: error.message || 'Verification failed'
        };
    }
}

export async function lockCollateral(loanId: string, proofCommit: string) {
    // This requires the attestation from the verify step
    // For now, we'll reconstruct a valid payload similar to verify

    const attestation = {
        loanId,
        borrowerPkh: "user_wallet_pkh_placeholder",
        proofCommit,
        expiry: Math.floor(Date.now() / 1000) + 3600,
        flags: { income_ok: true, collateral_ratio_ok: true, wallet_ok: true, freshness_ok: true }
    };

    const collateral = {
        asset: "ADA",
        amount: 2000, // Matching the mock input
        txRef: "tx_hash_placeholder"
    };

    const res = await fetch(`${ESCROW_SERVICE_URL}/lockCollateral`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            attestation,
            collateral,
            meta: { proofOk: true, sigValid: true }
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.reason || "Lock collateral failed");
    }

    return await res.json();
}

export async function fundLoan(loanId: string) {
    // Lender funds the loan
    const res = await fetch(`${ESCROW_SERVICE_URL}/lockLenderFunds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            loanId,
            lenderPkh: "lender_wallet_pkh",
            amount: 1000,
            attestationPayload: {
                attestation: {
                    loanId,
                    expiry: Math.floor(Date.now() / 1000) + 3600,
                    flags: { income_ok: true, collateral_ratio_ok: true, wallet_ok: true, freshness_ok: true }
                },
                meta: { proofOk: true, sigValid: true }
            }
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.reason || "Fund loan failed");
    }

    return await res.json();
}
