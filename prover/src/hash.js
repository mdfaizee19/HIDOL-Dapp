// src/hash.js
import crypto from "crypto";

export function computeProofCommit(proofHex) {
  if (!proofHex || typeof proofHex !== "string") {
    throw new Error("proofHex must be hex string");
  }
  return crypto.createHash("sha256").update(Buffer.from(proofHex, "hex")).digest("hex");
}
