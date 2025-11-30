// Temporary fake prover + fake backend + fake tx

import type {
    ProverInput,
    ProverOutput,
    BackendRequest,
    BackendResponse,
    TransactionResult,
    VerifyRequest,
    VerifyResponse,
} from '@/types';

// Fake Prover - simulates zero-knowledge proof generation
export async function generateProof(input: ProverInput): Promise<ProverOutput> {
    // Simulate proof generation delay
    await delay(2000);

    // Generate fake proof data
    const fakeProof = btoa(
        JSON.stringify({
            secret: hashString(input.secret),
            publicData: input.publicData,
            timestamp: Date.now(),
        })
    );

    const publicInputs = [
        input.publicData,
        hashString(input.publicData),
        Date.now().toString(),
    ];

    return {
        proof: fakeProof,
        publicInputs,
        verified: true,
    };
}

// Fake Backend - simulates backend API calls
export async function submitToBackend(
    request: BackendRequest
): Promise<BackendResponse> {
    // Simulate network delay
    await delay(1500);

    // Simulate random success/failure (90% success rate)
    const success = Math.random() > 0.1;

    if (success) {
        const fakeTxHash = generateFakeTxHash();
        return {
            success: true,
            txHash: fakeTxHash,
            message: 'Transaction submitted successfully',
        };
    } else {
        return {
            success: false,
            message: 'Backend validation failed',
        };
    }
}

// Fake Proof Verification - simulates backend proof verification
export async function mockVerifyProof(req: VerifyRequest): Promise<VerifyResponse> {
    // Simulate network delay
    await delay(1500);

    // Generate fake attestation
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now
    const signature = generateFakeTxHash(); // Use fake hash as signature

    return {
        success: true,
        attestation: {
            loanId: req.loanId,
            proofCommit: req.proofCommit,
            expiry,
            signature,
        },
        message: 'Proof verified successfully',
    };
}

// Fake Transaction - simulates Cardano transaction
export async function submitTransaction(
    proof: string,
    publicInputs: string[]
): Promise<TransactionResult> {
    // Simulate transaction submission delay
    await delay(1000);

    const txHash = generateFakeTxHash();

    // Simulate transaction confirmation
    setTimeout(() => {
        console.log(`Transaction ${txHash} confirmed at block ${Math.floor(Math.random() * 1000000)}`);
    }, 3000);

    return {
        txHash,
        status: 'pending',
    };
}

// Fake transaction status checker
export async function checkTransactionStatus(
    txHash: string
): Promise<TransactionResult> {
    await delay(500);

    // Simulate random status
    const statuses: Array<'pending' | 'confirmed' | 'failed'> = [
        'pending',
        'confirmed',
        'confirmed',
        'confirmed',
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
        txHash,
        status,
        blockHeight: status === 'confirmed' ? Math.floor(Math.random() * 1000000) : undefined,
    };
}

// Helper functions
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
}

function generateFakeTxHash(): string {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// Fake wallet connection
export async function connectWallet(): Promise<string> {
    await delay(1000);
    // Return a fake Cardano address
    return 'addr1qxy' + generateFakeTxHash().substring(0, 50);
}

export async function getWalletBalance(address: string): Promise<number> {
    await delay(500);
    // Return a random balance between 100-10000 ADA
    return Math.floor(Math.random() * 9900) + 100;
}

// Mock Submit Transaction - simulates on-chain transaction submission
export async function mockSubmitTx(action: string): Promise<string> {
    // Simulate transaction delay
    await delay(2000);

    // Generate fake transaction hash
    const txHash = generateFakeTxHash();

    console.log(`Mock transaction submitted: ${action} - ${txHash}`);

    return txHash;
}
