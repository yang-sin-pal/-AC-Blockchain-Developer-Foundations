# Bai 5.2 — Deploy & Interact with Ethers.js + Hardhat

**Goal:** Deploy a Solidity smart contract, send a write transaction to change its state, and read the result back — the core Hardhat + Ethers.js workflow.

---

## Table of Contents

1. [The Contract: Counter.sol](#1-the-contract-countersol)
2. [Project Structure](#2-project-structure)
3. [Setup](#3-setup)
4. [Unit Testing](#4-unit-testing)
5. [Deploy Script](#5-deploy-script)
6. [Interaction Script (The Core Workflow)](#6-interaction-script-the-core-workflow)
7. [Hardhat Config Explained](#7-hardhat-config-explained)
8. [TypeChain: Why It Matters](#8-typechain-why-it-matters)
9. [Common Errors &amp; Troubleshooting](#9-common-errors--troubleshooting)
10. [Summary: The 3-Step Workflow](#10-summary-the-3-step-workflow)

---

## 1. The Contract: Counter.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint256 public count; // 32 bytes -> slot 0
    address a;            // 20 bytes -> slot 1 (12 bytes unused, cannot fit another uint256)
    uint256 number;       // 32 bytes -> slot 2 (does not fit into slot 1, takes its own slot)
    uint8 b;              // 1 byte   -> slot 3

    function increment() public {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}
```

### What this contract does

- **`count`** — a `uint256` state variable, initialized to `0` by default.
- **`increment()`** — a **write** function. It changes on-chain state (`count += 1`). Calling this costs gas and requires a signed transaction.
- **`getCount()`** — a **view** (read-only) function. It returns the current value of `count` without modifying state. Calling this is free — no gas, no transaction needed.

### Storage layout

Solidity stores state variables in 32-byte "slots" sequentially:

| Variable   | Type    | Bytes | Slot | Notes                                       |
| ---------- | ------- | ----- | ---- | ------------------------------------------- |
| `count`  | uint256 | 32    | 0    | Occupies the full slot                      |
| `a`      | address | 20    | 1    | 12 bytes remain, but not enough for uint256 |
| `number` | uint256 | 32    | 2    | Cannot pack into slot 1, takes its own slot |
| `b`      | uint8   | 1     | 3    | Takes its own slot (remaining bytes unused) |

> **Key takeaway:** `getCount()` is a free off-chain read. `increment()` is a state-changing write that costs gas. This view/write distinction is fundamental to how smart contracts work.

---

## 2. Project Structure

```
ac-hardhat-template/
├── contracts/
│   └── Counter.sol          # Solidity source code
├── deploy/
│   └── 1-deploy.ts          # Deployment script (hardhat-deploy)
├── scripts/
│   └── test.ts              # Interaction script — send tx, read state
├── test/
│   └── Counter.test.ts      # Unit tests (Mocha + Chai)
├── typechain/               # Auto-generated TypeScript types (from compile)
├── artifacts/               # Auto-generated ABIs + bytecode (from compile)
├── deployments/             # Deployment records (created on deploy)
├── hardhat.config.ts        # Hardhat configuration
├── package.json             # Dependencies
├── .env                     # Your private keys (DO NOT commit)
├── .env_example             # Template for .env
└── tsconfig.json            # TypeScript config
```

| Folder/File           | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `contracts/`        | Solidity source code                                      |
| `deploy/`           | Deployment scripts using hardhat-deploy plugin            |
| `scripts/`          | One-off scripts to interact with deployed contracts       |
| `test/`             | Automated tests run locally via Hardhat network           |
| `typechain/`        | Generated typed contract bindings for TypeScript          |
| `artifacts/`        | Generated ABI and bytecode for each contract              |
| `deployments/`      | Records of deployed contracts (address, constructor args) |
| `hardhat.config.ts` | Network config, compiler settings, plugin registration    |

---

## 3. Setup

### Step 1: Install dependencies

```bash
npm install --legacy-peer-deps
```

> **Why `--legacy-peer-deps`?** The `hardhat-toolbox` v3 has a peer dependency conflict with `hardhat-verify` v2. This flag bypasses the strict peer dependency check so installation succeeds.

### Step 2: Configure environment

Copy `.env_example` to `.env` and fill in your private key:

```bash
copy .env_example .env   # Windows
cp .env_example .env     # macOS/Linux
```

Edit `.env`:

```
REPORT_GAS=
TESTNET_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ETHERSCAN_API=
```

- **`TESTNET_PRIVATE_KEY`** — the private key of a MetaMask (or other) wallet that holds Sepolia ETH. You can export it from MetaMask → Account Details → Export Private Key.
- **`REPORT_GAS`** — set to `1` to enable gas usage reporting in tests.

> **Never commit `.env` to git.** It is already in `.gitignore`.

### Step 3: Compile contracts

```bash
npx hardhat compile
```

This does two things:

1. Compiles `Counter.sol` and outputs ABI + bytecode to `artifacts/`.
2. Generates typed TypeScript bindings in `typechain/` (using the TypeChain plugin).

You must compile before you can import types like `import { Counter } from "../typechain"`.

---

## 4. Unit Testing

### The test file: `test/Counter.test.ts`

```typescript
import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { Counter } from "../typechain";

describe("Counter", function () {

  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    addr1: SignerWithAddress;
  // ... more signers

  let counter: Counter;

  const deploy = async () => {
    [deployer, admin, addr1] = await ethers.getSigners();

    // Deploy Counter contract
    counter = await (await ethers.getContractFactory("Counter")).deploy();
  };

  before(async () => {
    console.log("Deploying Counter contract...");
    await deploy();
  });

  describe("Deployment", function () {
    it("Should set the initial count to 0", async function () {
      const count = await counter.getCount();
      expect(count).to.equal(0n);
    });
  });

  describe("Increment", function () {
    it("Should increment the count by 1", async function () {
      const tx = await counter.increment();
      await tx.wait();

      const count = await counter.getCount();
      expect(count).to.equal(1n);
    });
  });
});
```

### How it works

1. **`ethers.getSigners()`** — returns an array of test accounts (Hardhat provides 20 accounts with 10,000 ETH each on the local network).
2. **`ethers.getContractFactory("Counter").deploy()`** — deploys a fresh Counter to the local Hardhat network.
3. **`before()`** — Mocha hook that runs once before all tests. Deploys a fresh contract so tests start clean.
4. **`expect(count).to.equal(0n)`** — Chai assertion. Note the `0n` — BigInt literal (ethers v6 returns BigInt, not BigNumber).

### Run the tests

```bash
npx hardhat test
```

**Expected output:**

```
Deploying Counter contract...
  Counter
    Deployment
      ✔ Should set the initial count to 0
    Increment
      ✔ Should increment the count by 1

  2 passing (xxx ms)
```

---

## 5. Deploy Script

### The deploy file: `deploy/1-deploy.ts`

```typescript
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("====================");
  console.log(hre.network.name);
  console.log("====================");

  console.log("====================");
  console.log("Deploy Counter Contract");
  console.log("====================");

  await deploy("Counter", {
    contract: "Counter",
    args: [],
    from: deployer,
    log: true,
    autoMine: true,
    skipIfAlreadyDeployed: false,
  });
};

func.tags = ["deploy"];
export default func;
```

### How it works

- **`hre` (Hardhat Runtime Environment)** — the global object that gives you access to ethers, deployments, network info, etc.
- **`getNamedAccounts()`** — returns a mapping of named accounts from `hardhat.config.ts`. Here, `deployer` is account index 0.
- **`deploy("Counter", {...})`** — the core hardhat-deploy call:
  - `contract: "Counter"` — which Solidity contract to deploy
  - `args: []` — constructor arguments (none for Counter)
  - `from: deployer` — which account deploys
  - `autoMine: true` — on local network, mine the tx immediately
  - `skipIfAlreadyDeployed: false` — always deploy a fresh instance
- **`func.tags = ["deploy"]`** — tags let you selectively run deploy scripts (e.g., only scripts tagged `"deploy"`).

### Deploy to Sepolia

```bash
npx hardhat deploy --network sepolia --tags deploy
```

> **Important:** You need Sepolia ETH in your wallet. Get it from a faucet like [sepoliafaucet.com](https://sepoliafaucet.com) or Alchemy's faucet.

---

## 6. Interaction Script (The Core Workflow)

This is the main lesson — sending a transaction and reading state.

### The script: `scripts/test.ts`

```typescript
import { ethers } from "hardhat";
import { Counter } from "../typechain";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", deployer.address);

  const counter: Counter = await ethers.getContract("Counter");
  const tx = await counter.increment();
  await tx.wait();

  const count = await counter.getCount();
  console.log("Current count is:", count.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Line-by-line walkthrough

**1. Get the signer (the account that will send transactions):**

```typescript
const [deployer] = await ethers.getSigners();
```

Returns all available signers. We take the first one (`deployer`). On Sepolia, this is the account whose private key is in `.env`.

**2. Connect to the deployed contract:**

```typescript
const counter: Counter = await ethers.getContract("Counter");
```

This looks up the deployed Counter contract (using hardhat-deploy's deployment records) and returns a typed contract instance. The `Counter` type from TypeChain gives you autocomplete and type checking.

**3. Send a write transaction:**

```typescript
const tx = await counter.increment();
```

This sends a real transaction to the blockchain. `increment()` changes state (`count += 1`), so it costs gas. Returns a `ContractTransactionResponse`.

**4. Wait for confirmation:**

```typescript
await tx.wait();
```

The transaction is submitted but not yet confirmed. `tx.wait()` waits until a miner includes it in a block. Without this, the next read might return stale data.

**5. Read state back:**

```typescript
const count = await counter.getCount();
```

`getCount()` is a `view` function — it reads state without sending a transaction. Returns a `BigInt`.

**6. Log the result:**

```typescript
console.log("Current count is:", count.toString());
```

**Expected output:**

```
Deploying contracts with the account:  0x...
Current count is: 1
```

### The complete workflow in one diagram

```
 ┌─────────────────────────────────────────────────┐
 │           scripts/test.ts                       │
 │                                                 │
 │  1. Get signer ──────────► ethers.getSigners()  │
 │                                                 │
 │  2. Connect to contract ─► ethers.getContract() │
 │                                                 │
 │  3. Send WRITE tx ────────► counter.increment() │
 │       (costs gas)              │                │
 │                                ▼                │
 │  4. Wait for confirmation ──► tx.wait()         │
 │                                │                │
 │                                ▼                │
 │  5. READ state ───────────► counter.getCount()  │
 │       (free, no tx)             │               │
 │                                 ▼               │
 │  6. Log result ──────────► console.log(...)     │
 └─────────────────────────────────────────────────┘
```

### Run it

```bash
npx hardhat run scripts/test.ts --network sepolia
```

---

## 7. Hardhat Config Explained

### `hardhat.config.ts` — key sections

**Networks:**

```typescript
networks: {
  "sepolia": {
    url: "https://eth-sepolia.public.blastapi.io",
    chainId: 11155111,
    accounts: [testnetPrivateKey],
    timeout: 40000,
  },
  "ethereum": {
    url: "https://eth-mainnet.public.blastapi.io",
    chainId: 1,
    accounts: [mainnetPrivateKey],
    timeout: 60000,
  }
},
```

- `url` — the RPC endpoint to connect to the network. These are public Blast API endpoints.
- `chainId` — identifies the network (11155111 = Sepolia, 1 = Ethereum mainnet).
- `accounts` — the private keys used to sign transactions.

**Solidity compiler:**

```typescript
solidity: {
  compilers: [{
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 1000 },
      viaIR: true
    },
  }]
},
```

- `optimizer` — reduces bytecode size and gas cost at compile time.
- `viaIR` — uses the new Yul intermediate representation for compilation (more advanced optimization).

**Plugins (imported at top):**

```typescript
import "hardhat-deploy";            // Deployment management
import "hardhat-deploy-ethers";     // Ethers.js integration for hardhat-deploy
import "@nomicfoundation/hardhat-ethers";  // Core ethers plugin
import "@typechain/hardhat";        // TypeChain code generation
import "hardhat-contract-sizer";    // Shows contract sizes
import "hardhat-abi-exporter";      // Exports ABI to data/abi/
import "hardhat-gas-reporter";      // Gas usage reports
import "@openzeppelin/hardhat-upgrades";   // Proxy upgrade support
import "@nomicfoundation/hardhat-verify";  // Etherscan verification
```

**Named accounts:**

```typescript
namedAccounts: {
  deployer: 0,  // Account index 0 = the deployer
},
```

**TypeChain:**

```typescript
typechain: {
  outDir: "typechain",
  target: "ethers-v6",
},
```

Generates typed TypeScript bindings targeting ethers v6.

---

## 8. TypeChain: Why It Matters

When you run `npx hardhat compile`, TypeChain reads the compiled ABI and generates TypeScript types for each contract. This is what `typechain/Counter.ts` gives you.

### What you get

```typescript
// Without TypeChain — no type safety
const counter = await ethers.getContract("Counter");
await counter.increment();  // typo? no error until runtime
await counter.nonExistent(); // runtime error!

// With TypeChain — full type safety
import { Counter } from "../typechain";
const counter: Counter = await ethers.getContract("Counter");
await counter.increment();   // ✓ autocomplete + compile-time check
await counter.nonExistent(); // ✗ compile error!
```

### The generated `Counter` type

The key methods on the `Counter` type:

```typescript
count: TypedContractMethod<[], [bigint], "view">;
getCount: TypedContractMethod<[], [bigint], "view">;
increment: TypedContractMethod<[], [void], "nonpayable">;
```

- **`TypedContractMethod<InputArgs, ReturnType, Mutability>`**
  - `increment` takes no args, returns `void`, is `nonpayable` (costs gas)
  - `getCount` takes no args, returns `bigint`, is `view` (free read)

### Rule

> Always run `npx hardhat compile` before importing types from `../typechain`. If you don't, TypeScript will throw "module not found" errors.

---

## 9. Common Errors & Troubleshooting

### Error: "Cannot find module '../typechain'"

**Cause:** TypeChain types haven't been generated yet.

**Fix:**

```bash
npx hardhat compile
```

### Error: ".env" validation or missing key

**Cause:** `.env` file missing or `TESTNET_PRIVATE_KEY` is not set.

**Fix:**

1. Copy `.env_example` to `.env`
2. Set `TESTNET_PRIVATE_KEY=0x...` with a valid private key

### Error: npm peer dependency conflict

**Cause:** `hardhat-toolbox` v3 conflicts with `hardhat-verify` v2.

**Fix:**

```bash
npm install --legacy-peer-deps
```

### Error: insufficient funds

**Cause:** Your Sepolia wallet has no ETH.

**Fix:** Get testnet ETH from a faucet (e.g., https://sepoliafaucet.com).

### Error: nonce too high / replacement transaction underpriced

**Cause:** Multiple pending transactions from the same account, or gas price too low.

**Fix:** Wait a few seconds between transactions, or increase the gas price in MetaMask.

### `npx hardhat run` vs `npx hardhat deploy`

| Command                                                | When to use                                          |
| ------------------------------------------------------ | ---------------------------------------------------- |
| `npx hardhat deploy --network sepolia --tags deploy` | Deploy contracts (tracks deployments, supports tags) |
| `npx hardhat run scripts/test.ts --network sepolia`  | Run any script (interact, batch operations, etc.)    |

> **Don't use `hardhat run` for deployment.** Use `hardhat deploy` so deployments are tracked in the `deployments/` folder.

---

## 10. Summary: The 3-Step Workflow

After setting up the project, the standard workflow is:

```bash
# Step 1: Test locally
npx hardhat test

# Step 2: Deploy to Sepolia
npx hardhat deploy --network sepolia --tags deploy

# Step 3: Interact with deployed contract
npx hardhat run scripts/test.ts --network sepolia
```

**Expected final output:**

```
Deploying contracts with the account:  0x...
Current count is: 1
```

### The full lifecycle

```
  Write Solidity     Compile          Test Locally
  ──────────────►  ──────────►  ──────────────────►
  contracts/         artifacts/      npx hardhat test
  Counter.sol        typechain/

       │                                    │
       │                                    ▼
       │                              All tests pass?
       │                                    │
       │                               Yes  │  No → fix & retest
       │                                    │
       ▼                                    ▼
  Deploy to Sepolia                  Deploy to Sepolia
  npx hardhat deploy                 npx hardhat run scripts/test.ts
  --network sepolia                  --network sepolia
       │
       ▼
  Interact / Verify
  npx hardhat run scripts/test.ts
  --network sepolia
```
