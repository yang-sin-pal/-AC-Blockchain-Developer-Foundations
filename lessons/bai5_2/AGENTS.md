# AGENTS.md — bai5_2 (Counter + Ethers.js/Hardhat)

Exercise spec: `README.md` (this folder). Full walkthrough incl. troubleshooting: `ac-hardhat-template/TUTORIAL.md`.

Goal: deploy Counter, call `increment()`, print `getCount()` — expect `1`.

## Current state (verified)

- Template at `ac-hardhat-template/` is installed: `node_modules/`, generated `typechain/`, populated `.env`
- Deployed on Sepolia: Counter at `0xb656c0ce3B333Ad0F9486CfB9Fed2BF4944A3351` (record in `deployments/sepolia/Counter.json`, mined at block 11553717); on-chain `getCount()` = 1 after the interaction script ran
- Contract: `contracts/Counter.sol` (Solidity 0.8.28)
- Report with screenshots: `solution.md` + `solution_images/`

## Commands

Run everything inside `ac-hardhat-template/`, in this order:

```bash
npx hardhat test                                        # unit tests (local network)
npx hardhat deploy --network sepolia --tags deploy      # deploy Counter to Sepolia
npx hardhat run scripts/test.ts --network sepolia       # increment() + getCount()
```

Note: the lesson README shows `npx hardhat run scripts/test.ts` without a network flag — that fails unless deployed locally; always pass `--network sepolia`.

## Gotchas

- After editing contracts, rerun `npx hardhat compile` first: it regenerates `typechain/` and re-exports ABI to `data/abi/`; `import { Counter } from "../typechain"` breaks otherwise
- Deploy script sets `skipIfAlreadyDeployed: false` — redeploying creates a fresh Counter each time
- Sepolia RPC was switched from BlastAPI (shut down, returns 403) to PublicNode (`https://ethereum-sepolia-rpc.publicnode.com`) in `hardhat.config.ts`; mocha timeout is 40s
- The `ethereum` mainnet network entry still points at the defunct BlastAPI URL — replace it before ever using that network
- Template ships both `package-lock.json` and `yarn.lock`; install with `npm install --legacy-peer-deps`
