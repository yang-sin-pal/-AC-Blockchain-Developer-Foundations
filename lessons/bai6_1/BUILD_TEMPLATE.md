# Building an `ac-hardhat-template` From Scratch

A standalone, machine-independent recipe for recreating the course's Hardhat template yourself — no copying from `bai5_2`, no cloning GitHub. Follow it top to bottom; every file is given in full, every choice is explained.

> **Why build instead of copy?** On a new machine you may not have the old template handy. More importantly, after this walkthrough you will know what every folder and config block does, so breakages become diagnosable instead of mysterious.

## Final result — directory tree

```
ac-hardhat-template/
├── contracts/
│   └── Counter.sol          # Solidity source (Phase D)
├── deploy/
│   ├── 1-deploy.ts          # hardhat-deploy script (Phase G)
│   └── .gitignore           # ignore deployment records except markers
├── scripts/
│   └── test.ts              # interaction script (Phase H)
├── test/
│   └── Counter.test.ts      # unit tests (Phase F)
├── data/abi/                # generated: exported ABIs (compile)
├── artifacts/               # generated: ABI + bytecode (compile)
├── cache/                   # generated: compiler cache
├── typechain/               # generated: typed bindings (compile)
├── deployments/             # created on first deploy
├── hardhat.config.ts        # the brain (Phase C)
├── package.json
├── tsconfig.json
├── .env                     # secrets — never commit
├── .env_example
└── .gitignore
```

---

## Phase 0 — Prerequisites

| Requirement                                                | Check       | Notes                                                               |
| ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| Node.js ≥ 18 (LTS 20/22 recommended; 24 verified working) | `node -v` | Hardhat 2.x + toolbox v3 need modern Node                           |
| npm                                                        | `npm -v`  | ships with Node                                                     |
| A wallet with Sepolia ETH                                  | MetaMask    | needed only for Phase G/H (deploy + interact); local tests are free |
| Internet                                                   | —          | npm registry + an RPC endpoint                                      |

---

## Phase A — Scaffold on Hardhat 2 (pin before scaffolding!)

> ⚠️ **Hardhat 3 exists — do NOT use it here.** Bare `npx hardhat init` now resolves to HH 3.x, whose plugin ecosystem is incompatible with this template: hardhat-deploy v2 is an ESM rewrite that removed `namedAccounts` and `hardhat-deploy-ethers` entirely. Every pattern in Phases C–H assumes the Hardhat 2 API. This course's stack is HH 2.x only (verified working up to Node 24).

```bash
mkdir ac-hardhat-template
cd ac-hardhat-template

# create package.json, then PIN the Hardhat 2 line BEFORE scaffolding
npm init -y
npm install --legacy-peer-deps --save-dev hardhat@^2.25.0 @nomicfoundation/hardhat-toolbox@^3.0.0

# opens the HH2 welcome wizard (it appears because no config file exists yet)
npx hardhat
```

- If `npx` prompts *"Need to install the following packages: hardhat@3.x — Ok to proceed? (y/n)"* → answer **n**: it means npx found no local install and is fetching the latest major. The pinned install above makes this impossible.
- In the wizard choose **"Create a TypeScript project"**, accept defaults (it adds `.gitignore`; the sample dependencies it offers are already satisfied by your pinned install).
- The wizard generates: base `tsconfig.json`, empty `contracts/ scripts/ test/` folders, a sample `Lock.sol` trio, and a stock `task("accounts", ...)` in `hardhat.config.ts`.

**Clean up the samples** — delete:

```text
contracts/Lock.sol
test/Lock.test.ts
scripts/deploy.ts      (if present)
```

Keep the `accounts` task in the config for now (it's a handy smoke test).

### What the scaffold gave you

| Piece                                | Role                                                                                                 |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `@nomicfoundation/hardhat-toolbox` | meta-package bundling ethers v6, chai matchers, network helpers, Etherscan verify, TypeChain support |
| `tsconfig.json`                    | `commonjs` modules / `es2020` target — matches how Hardhat loads TS configs and scripts         |
| `.gitignore`                       | already ignores`node_modules/`, `artifacts/`, `cache/`                                         |

---

## Phase B — Dependencies beyond the toolbox

The toolbox does **not** include deployment tracking or some quality-of-life tooling. Install:

```bash
# tracked deployments + typed bindings (the @typechain/* plugin+emitter ride along —
# toolbox normally supplies them, but partial installs drop them; explicit = safe;
# ethers pinned too — recovery-mode installs can leave a stale v5 hoisted)
npm install --legacy-peer-deps -D hardhat-deploy@^1.0.1 hardhat-deploy-ethers@^0.4.2 typechain@^8.3.2 @typechain/hardhat@^9.1.0 @typechain/ethers-v6@^0.5.1 ethers@^6.13.5

# OpenZeppelin stack + dev tooling
npm install --legacy-peer-deps @openzeppelin/contracts@^5.1.0 @openzeppelin/contracts-upgradeable@5.3.0 @openzeppelin/hardhat-upgrades@^3.9.0 hardhat-abi-exporter@^2.10.1 hardhat-contract-sizer@^2.9.0 hardhat-gas-reporter@2.3.0 dotenv@^16.0.3

# test stack, explicit — this template imports plugins individually (no toolbox
# import), so nothing bundles chai / mocha globals / the ts toolchain for us.
# Local ts-node + typescript also stop Node from silently borrowing them out of an
# ancestor repo's node_modules. chai stays v4: v5 is ESM-only and breaks Hardhat's
# CJS require chain.
npm install --legacy-peer-deps -D chai@^4.3.6 "@types/chai@^4.3.16" "@types/mocha@^10.0.10" ts-node@^10.9.2 typescript@^5.8.3 "@nomicfoundation/hardhat-chai-matchers@^1.0.6"

# ethers/verify plugins EXPLICITLY — hardhat-upgrades aborts (HH801) without them,
# because toolbox v3's bundled versions are too old to satisfy it
npm install --legacy-peer-deps -D "@nomicfoundation/hardhat-ethers@^3.0.6" "@nomicfoundation/hardhat-verify@^2.0.14"
```

**Why each package:**

| Package                                    | Why                                                                                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `hardhat-deploy`                         | `deploy/` folder workflow: tags, named accounts, deterministic ordering, writes `deployments/<network>/<Contract>.json` records |
| `hardhat-deploy-ethers`                  | patches`ethers.getContract("Name")` to auto-load those records — the magic used by the interaction script                        |
| `typechain`                              | explicit devDep; generates typed contract classes into`typechain/` at compile time                                                |
| `hardhat-ethers` + `hardhat-verify`    | installed explicitly —`hardhat-upgrades` aborts with HH801 unless it can resolve them itself (toolbox's copies are too old)      |
| `@openzeppelin/contracts`                | audited ERC20/ERC721/etc. implementations                                                                                           |
| `...-upgradeable` + `hardhat-upgrades` | proxy/upgrade support for later lessons                                                                                             |
| `abi-exporter`                           | dumps clean ABIs to`data/abi/` on every compile (handy for frontends)                                                             |
| `contract-sizer`                         | `npx hardhat size-contracts` — catches the 24 KB limit early                                                                     |
| `gas-reporter`                           | per-function gas table when`REPORT_GAS=1`                                                                                         |
| `dotenv`                                 | loads`.env` into `process.env`                                                                                                  |

**Why `--legacy-peer-deps`, always:** this dependency set contains deliberate peer-range violations — toolbox v3 wants `hardhat-gas-reporter@^1.0.8` while we pin `2.3.0`, and toolbox's bundled `hardhat-verify` predates what `hardhat-upgrades` demands. npm's strict resolver aborts on such conflicts; the flag says "proceed, we know".

> ⚠️ **Every npm command in this project carries `--legacy-peer-deps`.** A bare `npm install` re-checks peers strictly and dies with `ERESOLVE` (usually pointing at gas-reporter).

---

## Phase C — `hardhat.config.ts`, section by section

Replace the whole file with this (working RPC included), then read the breakdown below:

```typescript
import { task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-verify";
import "hardhat-contract-sizer";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";

dotenv.config();

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) console.log(account.address);
});

const { TESTNET_PRIVATE_KEY, MAINNET_PRIVATE_KEY } = process.env;
const reportGas = process.env.REPORT_GAS;

module.exports = {
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      chainId: 11155111,
      accounts: [TESTNET_PRIVATE_KEY],
      timeout: 40000,
    },
    ethereum: {
      // NOTE: public RPCs come and go — if this dies, see the "When an RPC dies" sidebar
      url: "https://eth-mainnet.publicnode.com",
      chainId: 1,
      accounts: [MAINNET_PRIVATE_KEY],
      timeout: 60000,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: { enabled: true, runs: 1000 },
          viaIR: true,
        },
      },
    ],
  },
  abiExporter: {
    path: "data/abi",
    runOnCompile: true,
    clear: true,
    flat: false,
    only: [],
    spacing: 4,
  },
  gasReporter: {
    enabled: reportGas == "1",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
  },
  etherscan: {
    apiKey: { mainnet: "" },
  },
  sourcify: { enabled: false },
  mocha: {
    timeout: 40000,
  },
  namedAccounts: {
    deployer: 0,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
};
```

### Breakdown

| Block                        | What it does / why it matters                                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| imports (top)                | registering a plugin mutates the Hardhat Runtime Environment (HRE) — order is not critical here but all must load before`module.exports`                                                 |
| `dotenv.config()`          | populates`process.env` from `.env` **before** the config object reads keys                                                                                                        |
| `task("accounts", ...)`    | custom CLI task;`npx hardhat accounts` should print your wallets — first smoke test                                                                                                      |
| `networks.sepolia`         | `url`: JSON-RPC endpoint; `chainId` guards against signing for the wrong chain (11155111 = Sepolia); `accounts` array = signing keys; `timeout` raised because public RPCs are slow |
| `solidity`                 | 0.8.28 compiler; optimizer (1000 runs) trades longer compile for cheaper execution;`viaIR` routes through Yul IR for deeper optimization                                                  |
| `abiExporter`              | on every compile, write ABIs to`data/abi/<source-path>/Contract.json`; `clear: true` wipes stale exports                                                                                |
| `gasReporter`              | off unless env`REPORT_GAS=1` — keeps normal test output clean                                                                                                                            |
| `contractSizer`            | prints contract sizes on compile                                                                                                                                                            |
| `etherscan` / `sourcify` | verification plumbing — inert here; Phase K verifies manually via web (no keys)                                                                                                                    |
| `mocha.timeout`            | tests hit real networks sometimes; 40 s avoids flaky failures                                                                                                                               |
| `namedAccounts`            | `deployer` = account index 0 → deploy scripts say `from: deployer` instead of hardcoding addresses                                                                                     |
| `typechain`                | output dir + ethers-v6 codegen target                                                                                                                                                       |

### Wire the env the config just promised

The config reads `TESTNET_PRIVATE_KEY` / `MAINNET_PRIVATE_KEY` — and Hardhat validates every network's accounts on **every** command, even ones that never touch those networks (like `compile`). With no `.env` file both resolve to `undefined` and you get:

```
Error HH8: Invalid account: #0 for network: sepolia - Expected string, received undefined
```

So create the env files **now**, not at deploy time. First `.env_example` (committed template others must fill):

```text
REPORT_GAS=
TESTNET_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
MAINNET_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000
ETHERSCAN_API=
```

Then your real `.env` (never committed) — placeholders fine for now:

```bash
copy .env_example .env    # Windows
cp .env_example .env      # macOS/Linux
```

> Zero-key placeholders satisfy validation and work for compile + local tests, but are **not deployable** — Phase G swaps in a real funded key.

**Checkpoint:** with `.env` in place, `npx hardhat` exits clean and lists extra tasks including `deploy` (from hardhat-deploy) and `size-contracts`.

---

## Sidebar — When an RPC dies (it will)

Symptoms: `ProviderError 403/404`, connection refused, or hangs during deploy/test-on-network.

1. Confirm it's the endpoint, not your key: `curl <url> -X POST -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_chainId\",\"params\":[],\"id\":1}"` — a healthy endpoint answers `{"result":"0xaa36a7",...}` (Sepolia) or similar.
2. Find alternates: [chainlist.org](https://chainlist.org) (pick your chain, try endpoints top-down), or known-good providers like `publicnode.com`, `1rpc.io`, `drpc.org`.
3. Swap the `url` in `hardhat.config.ts`. Nothing else changes — chainId stays the same.

> This template originally shipped with BlastAPI URLs that returned 403 once the service shut down. Any hardcoded public RPC is a liability; knowing the swap procedure *is* part of the setup skill.

---

## Phase D — The example contract

Create `contracts/Counter.sol`:

> **Encoding warning (Windows):** author files in VS Code as plain **UTF-8**. PowerShell redirection (`>`, `Out-File`) writes UTF-16, and `Set-Content -Encoding UTF8` under PS 5.1 writes UTF-8 **with BOM** — solc rejects both with a baffling `ParserError` at line 1 col 1 even though the text looks pristine. If you must script file creation, use `[System.IO.File]::WriteAllText($p, $t, [System.Text.UTF8Encoding]::new($false))`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint256 public count; // 32 bytes -> slot 0
    address a;            // 20 bytes -> slot 1 (12 bytes unused, cannot fit another uint256)
    uint256 number;       // 32 bytes -> slot 2 (does not fit into slot 1)
    uint8 b;              // 1 byte   -> slot 3

    function increment() public {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}
```

Two teaching points baked in:

- **view vs write**: `getCount()` reads for free (an `eth_call`, no transaction); `increment()` mutates state (a signed transaction costing gas). This split drives everything in Phases F–H.
- **storage layout**: state variables pack into 32-byte slots sequentially; an `address` leaves 12 unusable bytes, forcing `number` into its own slot. Understanding slots later unlocks proxies, assembly, and gas golfing.

---

## Phase E — Compile: what gets generated

```bash
npx hardhat compile
```

Inspect the four outputs:

| Folder         | Contents                                   | Generated by     |
| -------------- | ------------------------------------------ | ---------------- |
| `artifacts/` | per-contract ABI + bytecode + debug builds | Hardhat core     |
| `cache/`     | solc cache (safe to delete)                | Hardhat core     |
| `typechain/` | `Counter.ts`, factories — typed classes | TypeChain plugin |
| `data/abi/`  | clean ABI JSON mirrors                     | abi-exporter     |

> **Rule:** anything importing `../typechain` breaks until you compile. Changed a contract? Recompile — type bindings and exported ABIs refresh together.

---

## Phase F — Unit testing (local, free, no keys)

Create `test/Counter.test.ts`:

```typescript
import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { Counter } from "../typechain";

describe("Counter", function () {
  let counter: Counter;

  before(async () => {
    console.log("Deploying Counter contract...");
    counter = await (await ethers.getContractFactory("Counter")).deploy();
  });

  describe("Deployment", function () {
    it("Should set the initial count to 0", async function () {
      expect(await counter.getCount()).to.equal(0n);
    });
  });

  describe("Increment", function () {
    it("Should increment the count by 1", async function () {
      const tx = await counter.increment();
      await tx.wait();

      expect(await counter.getCount()).to.equal(1n);
    });
  });
});
```

Concepts:

- **Hardhat's built-in network**: tests run against an ephemeral in-memory EVM — 20 pre-funded accounts (`ethers.getSigners()`), instant blocks, zero cost, fresh state per run.
- **`before()` hook**: one fresh deploy shared by all tests in the suite.
- **BigInt literals (`0n`)**: ethers v6 returns `bigint`, not BigNumber — assert against `0n`, not `0`.
- Optional: `REPORT_GAS=1 npx hardhat test` prints the gas table.

```bash
npx hardhat test
```

Expected:

```
Deploying Counter contract...
  Counter
    Deployment
      ✔ Should set the initial count to 0
    Increment
      ✔ Should increment the count by 1

  2 passing
```

---

## Phase G — Deployment machinery

Create `deploy/1-deploy.ts`:

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

Anatomy:

- **`hre`** — the runtime environment: everything plugins injected lives here.
- **`getNamedAccounts()`** resolves `deployer` via the config's `namedAccounts` mapping.
- **`deploy(name, opts)`** — `args` = constructor args; `autoMine` matters only on local networks; `skipIfAlreadyDeployed: false` forces a brand-new instance every run (flip to `true` for idempotent infra deploys).
- **`tags`** — lets `--tags deploy` select which scripts run; numeric filename prefix controls ordering when several exist.

### Secrets & funding

Phase C already created `.env` with placeholder keys — now make it deploy-grade:

1. **Fund the wallet**: Sepolia ETH from a faucet ([sepoliafaucet.com](https://sepoliafaucet.com), Alchemy/Infura faucets) — a few tenths of an ETH covers dozens of lesson deploys.
2. **Swap in the real key**: export it (MetaMask → Account details → Export private key) and paste into `.env` as `TESTNET_PRIVATE_KEY` — typed by you, locally. Never commit it, never share it in chats or screenshots.
3. **Sanity check**: `npx hardhat accounts --network sepolia` prints exactly one address — yours, derived from the key. (Bare `npx hardhat accounts` without a network flag prints 20 hardcoded local dev accounts instead — expected behavior, not an error: no flag = default local network = its own disposable mnemonic, your `.env` key never consulted.)

### Deploy

```bash
npx hardhat deploy --network sepolia --tags deploy
```

Success looks like:

```
====================
sepolia
====================
Deploy Counter Contract
deploying "Counter" (tx: 0x...)...: deployed at 0x... with N gas
```

New artifacts: `deployments/sepolia/Counter.json` (address + ABI + receipt — this record is what makes `ethers.getContract("Counter")` work later) and `deployments/sepolia/.chainId` (protects records from cross-network mixups).

On Etherscan the address shows raw bytecode immediately — but it stays **unverified** (no source, no Read/Write Contract tabs) until you run Phase K below.

---

## Phase H — Interaction script (the core write→read workflow)

Create `scripts/test.ts`:

```typescript
import { ethers } from "hardhat";
import { Counter } from "../typechain";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Interacting with the account: ", deployer.address);

  const counter: Counter = await ethers.getContract("Counter");

  const tx = await counter.increment();   // WRITE: costs gas
  await tx.wait();                        // wait for confirmation

  const count = await counter.getCount(); // READ: free view call
  console.log("Current count is:", count.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Line-by-line:

1. `getSigners()` — signer #0 comes from `TESTNET_PRIVATE_KEY` on Sepolia (or funded test accounts locally).
2. **`ethers.getContract("Counter")`** — normally ethers needs address+ABI+signer; here `hardhat-deploy-ethers` looks up `deployments/sepolia/Counter.json` automatically and wires the default signer. Delete that record and you get *"No Contract deployed with name: Counter"*.
3. Write calls return immediately with a tx handle; **`tx.wait()`** blocks until mined — skip it and the subsequent read may see stale state.
4. View calls are plain awaits.

```bash
npx hardhat run scripts/test.ts --network sepolia
```

Expected:

```
Interacting with the account:  0x...
Current count is: 1
```

Run it twice → `2`. Every run increments forever (because `skipIfAlreadyDeployed: false` gives a fresh Counter each deploy… but repeated runs reuse the same deployment until you redeploy).

---

## Phase I — Git hygiene audit

Root `.gitignore` must contain (initializer provides most; add any missing):

```gitignore
node_modules/
.env
artifacts/
cache/
coverage/
coverage.json
typechain/
```

And create `deploy/.gitignore` so deployment records stay local:

```gitignore
*
!.gitignore
!.chainId
```

Sanity check: `git status` should never offer `.env`.

---

## Phase J — End-to-end verification checklist

Run in order; do not proceed past a failing step.

- [X] `npx hardhat` — exits clean (placeholder `.env` present, no HH8); task list includes `compile`, `test`, `deploy`, `accounts`, `size-contracts`
- [X] `npx hardhat accounts --network sepolia` — prints exactly one address (your funded key); bare form prints the 20 local dev accounts instead
- [X] `npx hardhat compile` — creates `artifacts/`, `cache/`, `typechain/`, `data/abi/`
- [X] `npx hardhat test` — **2 passing**
- [X] `npx hardhat deploy --network sepolia --tags deploy` — prints deployed address; `deployments/sepolia/` populated
- [X] `npx hardhat run scripts/test.ts --network sepolia` — `Current count is: 1`
- [ ] After Phase K: Etherscan shows green ✓ + source at the address; Read Contract → `getCount()`

---

## Phase K — Source verification (manual, via web)

Deployed bytecode alone is opaque: Etherscan shows hex, no source, no Read/Write Contract tabs — anyone interacting must trust you blindly. Verification publishes your source plus exact compiler settings; the verifier recompiles and byte-compares against what's on-chain. Match → green checkmark, readable source, working Read tab.

> **Why no CLI here:** hardhat-verify's Hardhat-2 line froze at 2.1.3 (`dist-tags.hh2` — there is no 2.2), and v3 targets Hardhat 3 only. Since then Etherscan retired its V1 API (May 2025) and Sourcify moved endpoints, so the frozen client now receives HTML where it expects JSON (`Unexpected token '<'`) or deprecated-endpoint errors. Browsers run current clients — we verify there. No API keys needed for either registry.

### What you need — one file

`deployments/sepolia/solcInputs/<hash>.json` — the exact standard-json input solc consumed at deploy time (hardhat-deploy saves it automatically). It embeds every compiler setting (optimizer 1000 runs, `evmVersion: paris`, `viaIR: true`) plus the sources, so uploading it removes all guesswork — and the **same file feeds both registries**.

### Etherscan — unlocks Read/Write tabs

1. Open `https://sepolia.etherscan.io/address/<ADDRESS>#code` → **Verify & Publish**
2. Compiler Type: **Solidity (Standard JSON Input)** — not the single-file form
3. Upload the solcInputs json; compiler `v0.8.28+commit.7893614a`; license MIT; constructor arguments empty
4. Submit → green check; source and **Read Contract** tab appear

| Hidden knob | Deploy-time value | If you use the simple form instead |
| --- | --- | --- |
| Via IR | `true` | no such field exists on simple forms |
| EVM Version | `paris` | default target emits PUSH0 (`5f` opcodes) |

Both knobs mismatching ⇒ `err_code_2: Unable to find matching Contract Bytecode`. The standard-json upload makes the question disappear — it *is* the compiler's recipe card.

### Sourcify — independent registry, Perfect Match badge

1. [repo.sourcify.dev](https://repo.sourcify.dev) → Add contract → chain **Sepolia**, your address
2. Drop the **same solcInputs json** into the upload zone → verify
3. Expect **Perfect Match**

> The registries never sync with each other or with anything else: a freshly added address shows "not verified" until you submit something — that label is normal, not an error.

### Confirm

- Etherscan: green ✓, Solidity source visible, Read Contract → `getCount()`
- Sourcify: Perfect Match

Template complete once Phase K is green. For adapting it to a specific assignment (e.g. MyToken for bai6_1), continue with `PLAN.md`.

---

## Troubleshooting

| Symptom                                                                                                                                        | Cause                                                                                                                                                      | Fix                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Cannot find module '../typechain'`                                                                                                          | bindings not generated                                                                                                                                     | `npx hardhat compile`                                                                                                                                                                     |
| `ERESOLVE` / peer dependency error on install                                                                                                | toolbox v3 ↔ hardhat-verify v2 conflict                                                                                                                   | add`--legacy-peer-deps`                                                                                                                                                                   |
| Wizard offers/installs`hardhat@3.x`, or post-scaffold config errors about ESM / missing plugins                                              | `npx hardhat init` fetched Hardhat 3 (no pinned local install)                                                                                           | answer**n** at the npx prompt; run `npm i --legacy-peer-deps -D hardhat@^2.25.0 @nomicfoundation/hardhat-toolbox@^3.0.0`; scaffold with bare `npx hardhat`                        |
| `HH801: Plugin @openzeppelin/hardhat-upgrades requires … hardhat-ethers, hardhat-verify`                                                    | upgrades plugin can't resolve its peer deps through toolbox's outdated transitive copies                                                                   | `npm i --legacy-peer-deps -D "@nomicfoundation/hardhat-ethers@^3.0.6" "@nomicfoundation/hardhat-verify@^2.0.14"`                                                                          |
| `ERESOLVE` citing `hardhat-gas-reporter@2.3.0` vs peer `^1.0.8`                                                                          | an npm command ran without the flag (e.g. plain`npm install`)                                                                                            | re-run with`--legacy-peer-deps`; never use bare installs in this project                                                                                                                  |
| `Cannot find module '@typechain/hardhat'` — every command dies at config load                                                               | toolbox's transitive`@typechain/*` packages absent after ERESOLVE-recovery reinstalls                                                                    | `npm i --legacy-peer-deps -D "@typechain/hardhat@^9.1.0" "@typechain/ethers-v6@^0.5.1"`                                                                                                   |
| `HH8: Invalid account: #0 for network: sepolia - Expected string, received undefined`                                                        | networks reference env keys but`.env` is missing/unset                                                                                                   | create`.env` from `.env_example` (Phase C step); zero-key placeholders pass validation until Phase G                                                                                    |
| `TypeError: ethers_1.getAddress / resolveProperties is not a function` (signers/helpers)                                                     | ethers v5 hoisted at tree root while every plugin requires v6 — check`npm ls ethers` for `invalid` flags                                              | force the umbrella:`npm i --legacy-peer-deps -D "ethers@^6.13.5"`                                                                                                                         |
| `HH600 ParserError: Expected pragma...` pointing at a visually clean line 1                                                                  | UTF-8 BOM (or full UTF-16) written by PowerShell/editor — check first bytes for`EF BB BF`                                                               | strip it:`$p="contracts\Counter.sol"; $t=[IO.File]::ReadAllText($p); [IO.File]::WriteAllText($p,$t,[Text.UTF8Encoding]::new($false))` — or resave from VS Code as plain UTF-8            |
| `Cannot find module 'chai'` (or undefined `describe`/`it`, ts-node errors) during `npx hardhat test`                                   | test stack absent — config imports plugins individually and no toolbox bundles it                                                                         | `npm i --legacy-peer-deps -D chai@^4.3.6 "@types/chai@^4.3.16" "@types/mocha@^10.0.10" ts-node@^10.9.2 typescript@^5.8.3 "@nomicfoundation/hardhat-chai-matchers@^1.0.6"` — keep chai v4 |
| `invalid private key` / undefined account at sign time — or `Expected valid bigint: 0 < bigint < curve.n` from `normPrivateKeyToScalar` | `.env` missing/malformed, or the zero-key placeholder reached a live-network signer (placeholders pass config validation but are undeployable by design) | swap a real funded key into`TESTNET_PRIVATE_KEY` (Phase G); keep `0x` prefix; zero placeholder fine for unused `MAINNET_PRIVATE_KEY` and for compile/local tests only                 |
| `ProviderError 403/404`, timeouts on deploy                                                                                                  | RPC endpoint dead                                                                                                                                          | sidebar above                                                                                                                                                                               |
| `insufficient funds for intrinsic transaction cost`                                                                                          | wallet empty                                                                                                                                               | faucet top-up (Phase G)                                                                                                                                                                     |
| `nonce has already been used` / replacement underpriced                                                                                      | duplicate/stuck pending txs                                                                                                                                | wait a minute; rebroadcast with higher fee; restart terminal session                                                                                                                        |
| `No Contract deployed with name: X`                                                                                                          | missing`deployments/<network>/X.json`                                                                                                                    | deploy first, or run with matching`--network` flag                                                                                                                                        |
| mocha timeout on tests                                                                                                                         | slow RPC or long test                                                                                                                                      | raise`mocha.timeout` in config                                                                                                                                                            |
| `counter.someMethod is not a function`                                                                                                       | method absent from compiled ABI                                                                                                                            | fix contract name/spelling, recompile so typechain regenerates                                                                                                                              |
| `npm ls` shows `invalid:` flags / exits `ELSPROBLEMS` | stale peer ranges declared upstream (chai-matchers claiming `ethers ^5`, deploy-ethers wanting hardhat-deploy `^0.12`) plus newer-than-toolbox pins | nothing — if compile/test/deploy/interact all pass, the tree is fine; judge node_modules by behavior, never churn a working install chasing red flags |
| Verify: `Contract source code already verified` | exactly what it says | benign — nothing to do |
| Verify (web): `err_code_2 Unable to find matching Contract Bytecode` | simple-form recompile used different settings — Via IR has no field on those forms, and default EVM Version ≠ paris (recompiled code sprouts PUSH0 `5f` opcodes) | switch to **Standard JSON Input** and upload `deployments/sepolia/solcInputs/<hash>.json` — same file works for both registries |
| Verify via CLI: "deprecated V1 endpoint" / `Unexpected token '<' ... not valid JSON` | expected on Hardhat 2 — hardhat-verify froze at 2.1.3 (pre-Etherscan-V2, pre-Sourcify endpoint moves); no newer HH2-compatible release exists | don't fight it — verify manually via web per Phase K (keyless, standard-json) |
| Sourcify attempt times out / rate-limits | public server busy | retry later; Etherscan result is independent |
| Ghost files of a deleted contract persist (empty `artifacts/contracts/X.sol/` dir, orphaned `typechain/` `.ts` files) | `npx hardhat compile` is incremental — it updates artifacts for current sources and removes stale artifact *files*, but never garbage-collects empty dirs, old typechain outputs, or exported ABIs | delete strays by hand, or guarantee a spotless tree with `npx hardhat clean && npx hardhat compile` |
| Deleted `typechain/` by hand; rerunning compile regenerates nothing | incremental build trusts `cache/` fingerprints — unchanged sources ⇒ solc and the typegen hook are both skipped, regardless of missing output folders | output folders are disposable, cache isn't: always `npx hardhat clean` before recompiling after manual deletes |
