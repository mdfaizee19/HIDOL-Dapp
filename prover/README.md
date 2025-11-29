# Prover (Midnight Compact) - Minimal Hackathon Implementation

### Purpose
This folder implements the prover component. It exposes:
`generateProof(input) -> { proofBytes, proofCommit, publicFlags }`

Two modes:
- Deterministic JS fallback (works immediately for demos / integration)
- Real Midnight WASM (when you compile `circuit/loan_eligibility.compact` using Midnight toolchain)

### Quick test (node)
1. Install Node 18+.
2. Run:
   ```bash
   node test/run-test.js

"This project uses a secure deterministic prover fallback because the Midnight Compact → WASM toolchain is not public.
The architecture supports loading a real WASM ZK prover as soon as it becomes available by replacing wasm/index.js’s initRealWasmProver()."