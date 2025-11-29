// src/escrow.js
// In-memory escrow state machine for demo

const STATE = {
  REQUESTED: "Requested",
  COLLATERAL_LOCKED: "CollateralLocked",
  FUNDS_LOCKED: "FundsLocked",
  ACTIVE: "Active",
  DEFAULTED: "Defaulted",
  CLOSED: "Closed"
};

const loans = new Map(); // loanId -> loan object

function makeLoanFromAttestation(att) {
  return {
    loanId: att.loanId,
    borrowerPkh: att.borrowerPkh,
    proofCommit: att.proofCommit,
    collateralAmount: null,
    collateralAsset: null,
    lenderPkh: null,
    loanAmount: null,
    interestRateBps: 0,
    termSeconds: 0,
    status: STATE.REQUESTED,
    createdAt: Math.floor(Date.now() / 1000),
    nextDueTimestamp: null,
    remainingBalance: null,
    attestationSnapshot: att
  };
}

export function getLoan(loanId) {
  return loans.get(loanId) || null;
}

export function createOrGetLoanFromAttestation(att) {
  const id = att.loanId;
  if (!id) throw new Error("att.loanId required");
  let loan = loans.get(id);
  if (!loan) {
    loan = makeLoanFromAttestation(att);
    loans.set(id, loan);
  } else {
    // refresh attestation snapshot
    loan.attestationSnapshot = att;
  }
  return loan;
}

// Lock collateral (borrower action)
export function lockCollateral(att, collateral) {
  const loan = createOrGetLoanFromAttestation(att);
  if (loan.status !== STATE.REQUESTED) {
    throw new Error(`invalid_state: loan status ${loan.status}`);
  }
  // collateral = { asset: "ADA", amount: number, txRef: "txhash#idx" }
  loan.collateralAmount = collateral.amount;
  loan.collateralAsset = collateral.asset;
  loan.collateralRef = collateral.txRef || null;
  loan.status = STATE.COLLATERAL_LOCKED;
  return loan;
}

// Lock lender funds (lender action) attaches loan amount and lender pkh
export function lockLenderFunds(loanId, lenderPkh, amount, interestRateBps = 500, termSeconds = 7 * 24 * 3600) {
  const loan = loans.get(loanId);
  if (!loan) throw new Error("loan not found");
  if (loan.status !== STATE.COLLATERAL_LOCKED) throw new Error("collateral not locked");
  loan.lenderPkh = lenderPkh;
  loan.loanAmount = Number(amount);
  loan.interestRateBps = interestRateBps;
  loan.termSeconds = termSeconds;
  // set repayment schedule: simple single payment at termSeconds
  const now = Math.floor(Date.now() / 1000);
  loan.nextDueTimestamp = now + termSeconds;
  loan.remainingBalance = loan.loanAmount + Math.floor((loan.loanAmount * interestRateBps) / 10000);
  loan.status = STATE.FUNDS_LOCKED;
  return loan;
}

// Release loan (escrow pays borrower)
export function releaseLoan(loanId) {
  const loan = loans.get(loanId);
  if (!loan) throw new Error("loan not found");
  if (loan.status !== STATE.FUNDS_LOCKED) throw new Error("funds not locked");
  loan.status = STATE.ACTIVE;
  // produce simulated tx
  const tx = {
    txType: "DisburseLoan",
    loanId: loanId,
    to: loan.borrowerPkh,
    amount: loan.loanAmount,
    timestamp: Math.floor(Date.now() / 1000)
  };
  return { loan, tx };
}

// Repay (borrower sends repaymentAmount)
export function repay(loanId, amount) {
  const loan = loans.get(loanId);
  if (!loan) throw new Error("loan not found");
  if (![STATE.ACTIVE].includes(loan.status)) throw new Error("loan not active");
  loan.remainingBalance = Math.max(0, loan.remainingBalance - Number(amount));
  const now = Math.floor(Date.now() / 1000);
  // set nextDueTimestamp to now + 30 days for demo (can be adjusted)
  loan.nextDueTimestamp = now + 30 * 24 * 3600;
  if (loan.remainingBalance === 0) {
    loan.status = STATE.CLOSED;
  }
  const tx = {
    txType: "Repayment",
    loanId,
    from: loan.borrowerPkh,
    amount,
    timestamp: now
  };
  return { loan, tx };
}

// Liquidate (triggered when default or manual)
export function liquidate(loanId, reason = "manual") {
  const loan = loans.get(loanId);
  if (!loan) throw new Error("loan not found");
  if (loan.status === STATE.CLOSED) throw new Error("loan already closed");
  loan.status = STATE.DEFAULTED;
  // simulate collateral to lender transfer
  const tx = {
    txType: "Liquidation",
    loanId,
    to: loan.lenderPkh,
    collateralAmount: loan.collateralAmount,
    collateralAsset: loan.collateralAsset,
    reason,
    timestamp: Math.floor(Date.now() / 1000)
  };
  return { loan, tx };
}

// Close after repay: release collateral to borrower
export function closeLoan(loanId) {
  const loan = loans.get(loanId);
  if (!loan) throw new Error("loan not found");
  if (loan.status !== STATE.CLOSED) throw new Error("loan not closed (repayment incomplete)");
  const tx = {
    txType: "Close",
    loanId,
    to: loan.borrowerPkh,
    collateralAmount: loan.collateralAmount,
    collateralAsset: loan.collateralAsset,
    timestamp: Math.floor(Date.now() / 1000)
  };
  // optionally remove loan entry
  loans.delete(loanId);
  return { tx };
}

export function listLoans() {
  return Array.from(loans.values());
}

export const STATE_CONST = STATE;
