# AGENTS.md — bai5_2 (Counter + Ethers.js/Hardhat)

Exercise spec: `README.md` (this folder). All Hardhat work happens in the shared repo-root `ac-hardhat-template/` — this lesson's payload (contract, tests, scripts) was merged into it; see root `AGENTS.md`.

Goal: deploy Counter, call `increment()`, print `getCount()` — expect `1`.

## Current state (verified)

- Lesson complete; payload lives in the shared repo-root `ac-hardhat-template/` (contract, unit tests, `deploy/01-counter.ts`, `scripts/counter.ts`)
- Deployed on Sepolia: Counter at `0xb656c0ce3B333Ad0F9486CfB9Fed2BF4944A3351` (record migrated to `<root>/ac-hardhat-template/deployments/sepolia/Counter.json`)
- Report with screenshots: `solution.md` + `solution_images/`

## Commands

From repo-root `ac-hardhat-template/`:

```bash
npx hardhat test                                        # ALL accumulated unit tests (local network)
npx hardhat deploy --network sepolia --tags counter     # deploy a fresh Counter to Sepolia
npx hardhat run scripts/counter.ts --network sepolia    # increment() + getCount()
```

Note: the lesson README shows `npx hardhat run scripts/test.ts` without a network flag — that fails unless deployed locally; always pass `--network sepolia`.

## Gotchas

- After editing contracts, rerun `npx hardhat clean && npx hardhat compile` first: it regenerates `typechain/` for ALL accumulated contracts; `import { Counter } from "../typechain"` breaks otherwise
- Deploy script sets `skipIfAlreadyDeployed: false` with tag `counter` — but hardhat-deploy 1.x REUSES the existing Counter while its record + bytecode + args match (prints `reusing "Counter" at …`); to force a fresh instance, delete `deployments/sepolia/Counter.json` first
- Verification is manual web-flow only on this Hardhat 2 toolchain (CLI dead) — recipe: `ac-hardhat-template/GUIDE.md` Phase K
