# Cardano ZK-Proof DApp Frontend

A Next.js application for generating zero-knowledge proofs and submitting them to the Cardano blockchain.

## 🏗️ Project Structure

```
frontend/
 ┣ app/
 ┃ ┣ page.tsx       ← Main UI with step-by-step ZK-proof flow
 ┃ ┣ layout.tsx     ← Root layout component
 ┃ ┗ globals.css    ← Global styles with Tailwind
 ┣ lib/
 ┃ ┗ mock.ts        ← Mock prover, backend, and transaction simulators
 ┣ types/
 ┃ ┗ index.ts       ← TypeScript type definitions
 ┣ package.json
 ┣ next.config.js
 ┣ tailwind.config.js
 ┣ postcss.config.js
 ┗ tsconfig.json
```

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Features

### Step-by-Step Flow

1. **Wallet Connection** - Connect your Cardano wallet
2. **Input Data** - Enter secret and public data
3. **Generate Proof** - Create zero-knowledge proof
4. **Backend Validation** - Submit proof to backend for validation
5. **Blockchain Submission** - Submit transaction to Cardano
6. **Transaction Tracking** - Monitor transaction status

### Mock Implementation

Currently uses mock implementations for:
- **Prover**: Simulates ZK-proof generation
- **Backend**: Simulates API validation
- **Transactions**: Simulates Cardano blockchain interactions

## 🎨 UI Features

- Modern glassmorphic design
- Gradient backgrounds and effects
- Step-by-step progress indicator
- Real-time status updates
- Responsive layout
- Loading states and error handling

## 🔧 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## 📝 Next Steps

Replace mock implementations with real integrations:

1. **Prover Integration**: Connect to actual ZK-proof library (e.g., SnarkJS, Circom)
2. **Backend API**: Implement real backend endpoints
3. **Cardano Integration**: Use Cardano wallet connectors (e.g., Nami, Eternl)
4. **Smart Contract**: Deploy and interact with Cardano smart contracts

## 🛠️ Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

## 📦 Type Definitions

All types are defined in `types/index.ts`:
- `ProverInput` / `ProverOutput`
- `BackendRequest` / `BackendResponse`
- `ContractParams` / `TransactionResult`
- `AppState`

## 🎯 Mock Functions

Available in `lib/mock.ts`:
- `generateProof()` - Simulates proof generation
- `submitToBackend()` - Simulates backend submission
- `submitTransaction()` - Simulates blockchain transaction
- `checkTransactionStatus()` - Polls transaction status
- `connectWallet()` - Simulates wallet connection
- `getWalletBalance()` - Returns mock balance

---

Built with ❤️ for Cardano
