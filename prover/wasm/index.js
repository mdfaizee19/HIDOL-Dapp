// wasm/index.js
import crypto from "crypto";
import { verifyWalletSignature } from "../src/sigverify.js";
import { transcriptHash } from "../src/binding.js";

// Detect environment
const isBrowser = (typeof window !== "undefined");

// Path for WASM (browser or node)
const WASM_URL = "/prover/prover.wasm";       // browser (served as static asset)
const WASM_PATH_NODE = new URL('./prover.wasm', import.meta.url).pathname;

// ---------------------------------------------------------------------
// REAL WASM PROVER (replace this with actual Midnight WASM exports)
// ---------------------------------------------------------------------
async function initRealWasmProver() {
  let wasmBytes;

  if (isBrowser) {
    const resp = await fetch(WASM_URL);
    wasmBytes = await resp.arrayBuffer();
  } else {
    // Node
    const fs = await import("fs");
    if (!fs.existsSync(WASM_PATH_NODE)) {
      throw new Error("prover.wasm not found");
    }
    wasmBytes = fs.readFileSync(WASM_PATH_NODE);
  }

  const instance = await WebAssembly.instantiate(wasmBytes, {
    env: {},
  });

  const wasm = instance.exports;

  if (!wasm.run_proof) {
    throw new Error("WASM missing run_proof export.");
  }

  return {
    runProof: async (inputs) => {
      const inputStr = JSON.stringify(inputs);
      const inputBuf = new TextEncoder().encode(inputStr);
      const ptr = wasm.alloc(inputBuf.length);
      const mem = new Uint8Array(wasm.memory.buffer, ptr, inputBuf.length);
      mem.set(inputBuf);

      const outPtr = wasm.run_proof(ptr, inputBuf.length);
      const outMem = new Uint8Array(wasm.memory.buffer, outPtr, 8192);
      const outJson = new TextDecoder().decode(outMem).replace(/\0/g, "");
      const parsed = JSON.parse(outJson);

      return parsed;
    },
    mode: "real-wasm"
  };
}

// ---------------------------------------------------------------------
// Deterministic fallback prover (secure version)
// ---------------------------------------------------------------------
function deterministicProver(inputs) {
  const income_ok = inputs.incomeRaw > inputs.incomeThreshold;
  const debt_ok = inputs.debtFlagRaw ? 0 : 1;

  const cv = inputs.collateralAmount * inputs.oraclePrice;
  const rv = inputs.loanAmount * inputs.requiredCollateralRatio;
  const collateral_ratio_ok = cv >= rv;

  const freshness_ok =
    (inputs.currentTime - inputs.oracleTimestamp) <= inputs.maxOracleAge;

  const wallet_ok = verifyWalletSignature(
    inputs.borrowerPubKey,
    inputs.borrowerSignature,
    inputs.loanId
  );

  const canonical = JSON.stringify({
    loanId: inputs.loanId,
    borrowerPubKey: inputs.borrowerPubKey,
    collateralAmount: inputs.collateralAmount,
    oraclePrice: inputs.oraclePrice
  });

  const proofBytes = crypto
    .createHash("sha256")
    .update("MIDNIGHT-FAKE|" + canonical)
    .digest("hex");

  const proofCommit = transcriptHash(inputs, proofBytes);

  return {
    proofBytes,
    proofCommit,
    publicFlags: {
      income_ok,
      collateral_ratio_ok,
      wallet_ok,
      freshness_ok,
      debt_ok
    }
  };
}

// ---------------------------------------------------------------------
// initProver()
// ---------------------------------------------------------------------
export async function initProver() {
  try {
    // Try real WASM (browser or node)
    return await initRealWasmProver();
  } catch (err) {
    console.warn("[SECURE-MODE] No real WASM prover. Using fallback.");
    return {
      mode: "fallback",
      runProof: async (inputs) => deterministicProver(inputs)
    };
  }
}
