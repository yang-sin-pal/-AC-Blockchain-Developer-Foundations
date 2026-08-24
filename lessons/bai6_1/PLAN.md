# Bai 6.1 – Execution Plan

## Assignment summary

Build a basic ERC20 token with OpenZeppelin:

1. Contract `MyToken`: name `MyToken`, symbol `MTK`, supply 1,000,000 tokens minted entirely to the deployer in the constructor (`_mint(msg.sender, ...)`)
2. Deploy script (hardhat-deploy, tag `deploy`) that prints the contract address
3. Deploy to Sepolia: `npx hardhat deploy --network sepolia --tags deploy`
4. Run `test.ts` → must show the deployer's token balance

## Current state

- **No `ac-hardhat-template/` here** — we build one from scratch instead of cloning GitHub or copying bai5_2 (learning goal: be able to rebuild on any machine)
- **`lessons/bai6_1/test.ts`**: RPC already fixed to PublicNode (uncommitted edit), but ABI is still `[""]`, address is still the author placeholder, and the body calls nonexistent `contract.getBalance()` — must become `balanceOf(deployer)` once the real ERC20 ABI is in place
- Companion guide for Phase 0: **`BUILD_TEMPLATE.md`** (this folder)

## Phase 0 — Build the template from scratch (solo)

Follow `BUILD_TEMPLATE.md` phases in order; tick here as you go:

- [X] A. Scaffold: `npx hardhat init` (TypeScript project), delete Lock samples
- [X] B. Install hardhat-deploy/-ethers + typechain + OZ stack + tooling (`--legacy-peer-deps`)
- [X] C. Write `hardhat.config.ts` block-by-block; checkpoint: task list shows `deploy`
- [X] Sidebar: read "When an RPC dies" once — you'll need it someday
- [X] D. Write `contracts/Counter.sol`
- [X] E. `npx hardhat compile`; identify artifacts/cache/typechain/data-abi outputs
- [X] F. Write `test/Counter.test.ts`; `npx hardhat test` → 2 passing
- [X] G. Write `deploy/1-deploy.ts`; create `.env_example` + real `.env` (**your funded key, typed by you only**); faucet if needed; deploy to Sepolia; inspect `deployments/sepolia/`
- [X] H. Write `scripts/test.ts`; run on sepolia → `Current count is: 1`
- [X] I. Git hygiene audit (root `.gitignore` + `deploy/.gitignore`)
- [X] J. Full verification checklist green

## Phase 1 — Swap Counter → MyToken

- [X] 1. Replace `contracts/Counter.sol` with `contracts/MyToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // 18 decimals default
    }
}
```

- [X] 2. Update `deploy/1-deploy.ts`: deploy `"MyToken"` (same tag `deploy`); rewrite `test/MyToken.test.ts` (name/symbol/decimals/totalSupply/deployer balance); delete Counter leftovers and `scripts/test.ts` (or rewrite it to transfer tokens)
- [X] 3. `npx hardhat compile` → typechain regenerates, ABI exports to `data/abi/`

## Phase 2 — Deploy + interaction

- [X] 4. `npx hardhat deploy --network sepolia --tags deploy` → note printed MyToken address; then verify manually per BUILD_TEMPLATE.md Phase K: upload `deployments/sepolia/solcInputs/<hash>.json` as Standard JSON Input on Etherscan, drop the same file at repo.sourcify.dev → confirm green ✓ + Perfect Match (no API keys, no config changes; MyToken constructor is argless)
- [X] 5. Finish `lessons/bai6_1/test.ts`: keep your PublicNode RPC line; replace `[""]` ABI with ERC20 reads (`name/symbol/decimals/totalSupply/balanceOf(address)`); paste deployed token address; body:

```ts
const [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
console.log(`${name} (${symbol}), decimals: ${decimals}`);

const balance = await contract.balanceOf(DEPLOYER_ADDRESS);
console.log("Current balance is:", ethers.formatUnits(balance, decimals));
```

> Your current edit calls `getBalance()` — that method doesn't exist on ERC20 and isn't in the empty ABI either. The correct read is `balanceOf(holder)`.

- [X] 6. `npx ts-node test.ts` from `lessons/bai6_1/` → expect `Current balance is: 1000000.0`

## Phase 3 — Report + docs

- [X] 7. Screenshot deploy output + test output terminal → save into `lessons/bai6_1/solution_images/` (kebab-case names)
- [X] 8. Create `solution.md` in the bai5_3 style (incl. Vietnamese Ghi chú section telling the from-scratch-build / empty-ABI story)
- [X] 9. Update root AGENTS.md: "only bai5_2 has ac-hardhat-template" goes stale now that bai6_1 has one

## Notes / gotchas

- All Hardhat commands run **inside** `lessons/bai6_1/ac-hardhat-template/`, never from repo root
- Order matters: `npx hardhat compile` before tests/scripts whenever contracts changed or typechain is missing
- Lesson-level `test.ts` runs OUTSIDE the template (plain ethers + ts-node via root node_modules) — it needs the deployed token address pasted in after step 4
- If stuck >15 min on any Phase 0 step, consult BUILD_TEMPLATE.md's Troubleshooting table before asking
