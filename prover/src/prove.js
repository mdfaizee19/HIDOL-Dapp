// src/prove.js
import { initProver } from "../wasm/index.js";
import { validateInput } from "./inputs.js";
import { computeProofCommit } from "./hash.js";

export async function generateProof(rawInput) {
  // Validate + normalize
  const input = validateInput(rawInput);

  // init prover (WASM if available, else deterministic fallback)
  const prover = await initProver();

  // run the prover - expected to return { proofBytes, proofCommit, publicFlags } OR
  // deterministic fallback returns { proofBytes, proofCommit, publicFlags }
  // Here, for real WASM you would call the exposed WASM function and parse its result.
  const result = await prover.runProof(input);

  // If real WASM returns raw proofBytes and separate flags, compute proofCommit here and normalize.
  let proofBytes = result.proofBytes;
  let publicFlags = result.publicFlags;

  if (!proofBytes) {
    throw new Error("Prover did not return proofBytes");
  }

  // Ensure proofCommit is computed exactly from proofBytes
  const proofCommit = computeProofCommit(proofBytes);

  return {
    proofBytes,
    proofCommit,
    publicFlags
  };
}
