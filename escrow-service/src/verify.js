// src/verify.js
// Lightweight attestation verifier for demo use.

export function nowUnix() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Basic attestation sanity checks for demo.
 * - verifies attestation expiry
 * - checks meta flags and proofOk
 * - optional policy check: require the set of flags to be true
 *
 * Returns {ok: boolean, reason: string|null, details: {...}}
 */
export function validateAttestation(payload, policy = { requireIncome: true, requireCollateralRatio: true, requireWallet: true, requireFreshness: true }) {
  if (!payload || !payload.attestation) {
    return { ok: false, reason: "missing_attestation" };
  }

  const att = payload.attestation;
  const meta = payload.meta || {};
  const now = nowUnix();

  if (!payload.signature && !meta.sigValid) {
    return { ok: false, reason: "no_signature" };
  }

  // expiry
  if (att.expiry && att.expiry < now) {
    return { ok: false, reason: "attestation_expired", details: { expiry: att.expiry, now } };
  }

  // proof validity
  if (meta.proofOk === false) {
    return { ok: false, reason: "proof_invalid" };
  }

  // basic policy checks against flags
  const f = att.flags || {};
  if (policy.requireIncome && !f.income_ok) {
    return { ok: false, reason: "income_check_failed", details: { flags: f } };
  }
  if (policy.requireCollateralRatio && !f.collateral_ratio_ok) {
    return { ok: false, reason: "collateral_ratio_failed", details: { flags: f, collateralRatio: meta.collateralRatio } };
  }
  if (policy.requireWallet && !f.wallet_ok) {
    return { ok: false, reason: "wallet_ownership_failed", details: { flags: f } };
  }
  if (policy.requireFreshness && !f.freshness_ok) {
    return { ok: false, reason: "oracle_stale", details: { flags: f } };
  }

  // If meta.sigValid available and false, treat as bad
  if (meta.sigValid === false) {
    return { ok: false, reason: "signature_invalid" };
  }

  // optional risk gating (demo)
  if (typeof att.riskScore === "number" && att.riskScore > 0.9) {
    return { ok: false, reason: "risk_too_high", details: { riskScore: att.riskScore } };
  }

  // passes basic checks
  return { ok: true, reason: null, details: { now, attestation: att, meta } };
}
