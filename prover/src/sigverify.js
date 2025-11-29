// src/sigverify.js
import nacl from "tweetnacl";

// Convert hex → Uint8Array
export function hexToBytes(hex) {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  if (hex.length % 2 !== 0) throw new Error("Invalid hex length");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

// Verifies: signature = Sign(borrowerPrivKey, loanId)
export function verifyWalletSignature(borrowerPubKeyHex, borrowerSignatureHex, loanIdHex) {
  try {
    const pub = hexToBytes(borrowerPubKeyHex);
    const sig = hexToBytes(borrowerSignatureHex);
    const msg = hexToBytes(loanIdHex);

    const ok = nacl.sign.detached.verify(msg, sig, pub);
    return ok;  // true or false
  } catch (e) {
    return false;
  }
}
