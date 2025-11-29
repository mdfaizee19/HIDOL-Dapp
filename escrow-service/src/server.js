// src/server.js
import express from "express";
import bodyParser from "body-parser";

import { validateAttestation } from "./verify.js";
import * as escrow from "./escrow.js";

const app = express();
app.use(bodyParser.json({ limit: "2mb" }));

const PORT = process.env.PORT || 4001;

// Lock collateral
app.post("/lockCollateral", (req, res) => {
  try {
    const payload = req.body; // expects payload.attestation and collateral info
    const policy = { requireIncome: true, requireCollateralRatio: true, requireWallet: true, requireFreshness: true };
    const v = validateAttestation(payload, policy);
    if (!v.ok) return res.status(400).json({ ok: false, reason: v.reason, details: v.details });

    const att = payload.attestation;
    // collateral: { asset, amount, txRef }
    const collateral = payload.collateral;
    if (!collateral || typeof collateral.amount !== "number") {
      return res.status(400).json({ ok: false, reason: "missing_collateral" });
    }
    const loan = escrow.lockCollateral(att, collateral);
    return res.json({ ok: true, loan });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Lock lender funds
app.post("/lockLenderFunds", (req, res) => {
  try {
    const { loanId, lenderPkh, amount, attestationPayload } = req.body;
    if (!loanId || !lenderPkh || !amount) return res.status(400).json({ ok: false, reason: "missing_fields" });

    // Optionally re-check attestation
    const v = validateAttestation(attestationPayload, { requireIncome: true, requireCollateralRatio: true, requireWallet: true, requireFreshness: true });
    if (!v.ok) return res.status(400).json({ ok: false, reason: v.reason });

    const loan = escrow.lockLenderFunds(loanId, lenderPkh, amount);
    return res.json({ ok: true, loan });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Release loan
app.post("/releaseLoan", (req, res) => {
  try {
    const { loanId } = req.body;
    if (!loanId) return res.status(400).json({ ok: false, reason: "missing_loanId" });

    // check attestation expiry / freshness via stored snapshot in loan
    const loan = escrow.getLoan(loanId);
    if (!loan) return res.status(404).json({ ok: false, reason: "loan_not_found" });

    const att = loan.attestationSnapshot;
    const v = validateAttestation({ attestation: att, meta: loan.attestationSnapshot }, { requireIncome: true, requireCollateralRatio: true, requireWallet: true, requireFreshness: true });
    if (!v.ok) return res.status(400).json({ ok: false, reason: "attestation_recheck_failed", details: v.reason });

    const result = escrow.releaseLoan(loanId);
    return res.json({ ok: true, tx: result.tx, loan: result.loan });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Repay
app.post("/repay", (req, res) => {
  try {
    const { loanId, amount } = req.body;
    if (!loanId || typeof amount !== "number") return res.status(400).json({ ok: false, reason: "missing_fields" });

    const result = escrow.repay(loanId, amount);
    return res.json({ ok: true, tx: result.tx, loan: result.loan });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Liquidate
app.post("/liquidate", (req, res) => {
  try {
    const { loanId, reason } = req.body;
    if (!loanId) return res.status(400).json({ ok: false, reason: "missing_loanId" });

    const result = escrow.liquidate(loanId, reason || "manual");
    return res.json({ ok: true, tx: result.tx, loan: result.loan });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Close
app.post("/close", (req, res) => {
  try {
    const { loanId } = req.body;
    if (!loanId) return res.status(400).json({ ok: false, reason: "missing_loanId" });

    const result = escrow.closeLoan(loanId);
    return res.json({ ok: true, tx: result.tx });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Admin listing
app.get("/loans", (req, res) => {
  return res.json({ ok: true, loans: escrow.listLoans() });
});

app.listen(PORT, () => {
  console.log(`Escrow simulation service running on http://localhost:${PORT}`);
});
