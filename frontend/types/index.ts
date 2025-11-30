// Types for inputs/outputs (prover + backend + contract)

// Prover types
export interface ProverInput {
    secret: string;
    publicData: string;
}

export interface ProverOutput {
    proof: string;
    publicInputs: string[];
    verified: boolean;
}

// Backend types
export interface BackendRequest {
    proof: string;
    publicInputs: string[];
    walletAddress: string;
}

export interface BackendResponse {
    success: boolean;
    txHash?: string;
    message: string;
}

// Contract types
export interface ContractParams {
    proof: string;
    publicInputs: string[];
}

export interface TransactionResult {
    txHash: string;
    status: 'pending' | 'confirmed' | 'failed';
    blockHeight?: number;
}

// UI State types
export interface AppState {
    step: 'input' | 'proving' | 'submitting' | 'complete';
    loading: boolean;
    error?: string;
}

// Verification types
export interface VerifyRequest {
    loanId: string;
    proofBytes: string;
    proofCommit: string;
}

export interface Attestation {
    loanId: string;
    proofCommit: string;
    expiry: string;
    signature: string;
}

export interface VerifyResponse {
    success: boolean;
    attestation: Attestation;
    message: string;
}
