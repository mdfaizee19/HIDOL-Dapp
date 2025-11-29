// src/inputs.js
export function validateInput(i) {
  const required = [
    "loanId",
    "borrowerPubKey",
    "borrowerSignature",
    "loanAmount",
    "collateralAmount",
    "oraclePrice",
    "oracleTimestamp",
    "incomeRaw",
    "debtFlagRaw",
    "requiredCollateralRatio",
    "incomeThreshold",
    "maxOracleAge"
  ];
  for (const f of required) {
    if (!(f in i)) {
      throw new Error(`Missing required field: ${f}`);
    }
  }
  // Basic typing checks
  if (typeof i.loanId !== "string") throw new Error("loanId must be hex string");
  if (typeof i.borrowerPubKey !== "string") throw new Error("borrowerPubKey must be hex string");
  if (typeof i.borrowerSignature !== "string") throw new Error("borrowerSignature must be hex string");
  // Convert numbers
  return {
    loanId: i.loanId,
    borrowerPubKey: i.borrowerPubKey,
    borrowerSignature: i.borrowerSignature,
    loanAmount: Number(i.loanAmount),
    collateralAmount: Number(i.collateralAmount),
    oraclePrice: Number(i.oraclePrice),
    oracleTimestamp: Number(i.oracleTimestamp),
    incomeRaw: Number(i.incomeRaw),
    debtFlagRaw: Boolean(i.debtFlagRaw),
    requiredCollateralRatio: Number(i.requiredCollateralRatio),
    incomeThreshold: Number(i.incomeThreshold),
    maxOracleAge: Number(i.maxOracleAge),
    // optionally provide currentTime for deterministic tests:
    currentTime: i.currentTime ? Number(i.currentTime) : Math.floor(Date.now() / 1000)
  };
}
