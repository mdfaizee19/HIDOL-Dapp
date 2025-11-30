"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { useWallet } from "@meshsdk/react";
import { Transaction } from "@meshsdk/core";

type LoanEvalInputs = {
  loanId: string;
  walletAddress: string;
  token: string;
  loanAmount: number;
  interest: number;
  collateralAmount: number;
  collateralTxHash: string;
  networkId: number;
  timestamp: number;
};

// Simple deterministic loanId generator
function generateLoanId(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return "loan_" + hash.toString(16);
}

async function sendLoanRequestToBackend(payload: any) {
  console.log("Sending loan payload to backend:", payload);

  const res = await fetch("http://localhost:4001/lockCollateral", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("Backend response:", data);

  if (!res.ok) {
    throw new Error(data.reason || data.error || "Backend rejected loan request");
  }

  return data;
}

export default function BuyPage() {
  const { wallet, connected } = useWallet();
  const { setState } = useApp();

  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [collateral, setCollateral] = useState("");

  const ESCROW_ADDRESS =
    "addr_test1qqnesrghmyafll7v99f2an04dmn0tthgu60keyqv39dxxwnqpp4mrp3gphgw2euvzyfjntzdzxtycs8f72ywnjkcmvmsx68nda";

  const EXPECTED_NETWORK = 0; // 0 = Testnet

  const handleSendRequest = async () => {
    if (!connected || !wallet) return alert("Please connect your wallet first!");
    if (!token || !amount || !interest || !collateral) return alert("Please fill all fields ✨");

    setState(prev => ({ ...prev, loading: true }));

    try {
      const networkId = await wallet.getNetworkId();
      if (networkId !== EXPECTED_NETWORK) {
        setState(prev => ({ ...prev, loading: false }));
        return alert("⚠️ Wrong Network — Switch wallet to TESTNET");  
      }

      const tx = new Transaction({ initiator: wallet });
      const collateralLovelace = BigInt(Math.floor(Number(collateral) * 1_000_000)).toString();
      tx.sendLovelace(ESCROW_ADDRESS, collateralLovelace);

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx, true);
      const txHash = await wallet.submitTx(signedTx);

      console.log("Collateral lock TX hash:", txHash);

      const usedAddresses = await wallet.getUsedAddresses();
      const walletAddress = usedAddresses[0];

      const timestamp = Date.now();
      const seed = [walletAddress, token, amount, interest, collateral, txHash, timestamp].join("|");
      const loanId = generateLoanId(seed);

      // Backend expected format
      const backendPayload = {
        attestation: {
          loanId,
          walletAddress,
          token,
          loanAmount: Number(amount),
          interest: Number(interest),
          collateralAmount: Number(collateral),
          collateralTxHash: txHash,
          networkId,
          timestamp,

          // ZK placeholders (backend requires these for validation)
          income: 50000,
          collateralRatio: 2.5,
          walletProof: "dummy-proof"
        },
        collateral: {
          asset: token,
          amount: Number(collateral),
          txRef: txHash
        }
      };

      await sendLoanRequestToBackend(backendPayload);

      setState(prev => ({ ...prev, loading: false }));
      alert(`✅ Loan request submitted!\nLoan ID: ${loanId}\nTx Hash: ${txHash}`);

    } catch (err: any) {
      console.error("ERROR:", err);
      setState(prev => ({ ...prev, loading: false }));
      alert("❌ " + err?.message);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-bold mb-4 text-white">Borrow Crypto</h2>
      <p className="text-gray-300 mb-6">Enter loan details & lock collateral securely.</p>

      <div className="flex flex-col gap-4 w-80">
        <input className="input-field" placeholder="Token (e.g., ADA)" value={token} onChange={e => setToken(e.target.value)} />
        <input className="input-field" placeholder="Loan Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <input className="input-field" placeholder="Interest Rate (%)" value={interest} onChange={e => setInterest(e.target.value)} />
        <input className="input-field" placeholder="Collateral (ADA)" value={collateral} onChange={e => setCollateral(e.target.value)} />

        <button
          onClick={handleSendRequest}
          className="px-6 py-3 rounded-md font-semibold bg-gradient-to-r from-emerald-400 to-green-600 hover:shadow-[0_0_15px_rgba(16,185,129,0.7)] transition text-black hover:scale-[1.03]"
        >
          Lock Collateral & Request Loan
        </button>
      </div>

      <style jsx>{`
        .input-field {
          padding: 10px 16px;
          border-radius: 8px;
          background: #1f1f1f;
          border: 1px solid #333;
          color: white;
        }
        .input-field:focus {
          outline: none;
          border: 1px solid #10b981;
        }
      `}</style>
    </DashboardLayout>
  );
}
