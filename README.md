# AI Verified Freelance Payments

A blockchain-based freelance payment system built on Stellar Soroban.

## Features

- Create freelance jobs
- Submit completed work
- Verify submitted work
- Create payment escrow
- Fund escrow
- Release payment after verification
- Track job and escrow status on-chain

## Tech Stack

- Rust
- Stellar Soroban
- Soroban SDK
- Stellar CLI
- React
- Vite

## Smart Contracts

### Job Contract

Handles:

- Job creation
- Work submission
- Job verification
- Job status tracking

Testnet Contract:

`CCF2A7XO4ZX5NPM37NAZVN5O3KX6GNSJTSYDQLKPX2YEFMAZVIH6GOX4`

### Payment Escrow Contract

Handles:

- Escrow creation
- Escrow funding
- Work submission
- Payment release
- Payment hold
- Escrow status tracking

Testnet Contract:

`CAAZDD3OMAVYYFBOI4XURPSUJFHNY6JQGYD4WHCGH4P5ZH5635MGBZQU`

## Testing

The escrow lifecycle test passed successfully.

```text
test_escrow_lifecycle ... ok

test result: ok. 1 passed; 0 failed
```

## Verified Testnet Flow

### Job Lifecycle

Create Job
→ Submit Work
→ Verify Job
→ Verified: true

### Payment Escrow Lifecycle

Created
→ Funded
→ Submitted
→ Released

Final Escrow Result:

- Job ID: 1
- Amount: 250
- Status: Released

## Project Structure

ai-verified-freelance-payments/
├── contracts/
│   ├── contracts/
│   │   ├── job/
│   │   └── payment-escrow/
│   └── ...
└── frontend/

## Network

Stellar Testnet

## Repository

https://github.com/2006anjali/ai-verified-freelance-payments
