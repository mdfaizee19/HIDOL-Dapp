// src/binding.js
import crypto from "crypto";

export function transcriptHash(input, proofBytesHex) {
  const t = JSON.stringify({
    domain: "MIDNIGHT-LOAN-ELIGIBILITY-V1",
    loanId: input.loanId,
    borrowerPubKey: input.borrowerPubKey,
    loanAmount: input.loanAmount,
    collateralAmount: input.collateralAmount,
    oraclePrice: input.oraclePrice,
    oracleTimestamp: input.oracleTimestamp,
    incomeThreshold: input.incomeThreshold,
    requiredCollateralRatio: input.requiredCollateralRatio,
    maxOracleAge: input.maxOracleAge,
    proofBytes: proofBytesHex
  });

  return crypto.createHash("sha256").update(t).digest("hex");
}
