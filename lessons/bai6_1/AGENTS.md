# AGENTS.md — bai6_1 (MyToken ERC20 + Hardhat)

Exercise spec: `README.md` (this folder). Portable build guide with all fixes baked in: `BUILD_TEMPLATE.md` (12 amendments); execution checklist: `PLAN.md` (Phase 0 ticked).

Goal: ERC20 `MyToken` ("MyToken"/"MTK", 1M minted to deployer in constructor), deployed on Sepolia, balance read via standalone ethers v6 script.

## Current state (verified — lesson complete)

- Template at `ac-hardhat-template/` fully built per `BUILD_TEMPLATE.md`: compiles, 5 unit tests pass (`test/MyToken.test.ts`)
- Deployed on Sepolia: MyToken at `0x82AAcD5Be037A483Fc3E0cC5f2B65747A18Ab595` (record in `deployments/sepolia/MyToken.json`, deployer wallet = same as bai5_2)
- Verified on BOTH registries via manual web flow: Etherscan (Standard JSON Input) + Sourcify (Perfect Match)
- Interaction tested: two `transfer` txs of 100 MTK each → deployer balance 999800
- Lesson-level `test.ts` finished (PublicNode RPC, ERC20 read ABI, real address) — prints `MyToken (MTK), decimals: 18` / `Current balance is: 999800.0`
- Report: `solution.md` + `solution_images/`

## Commands

Run everything inside `ac-hardhat-template/` except the last line:

```bash
npx hardhat test                                        # 5 passing (local network)
npx hardhat clean && npx hardhat compile                # full rebuild; see gotchas
npx hardhat deploy --network sepolia --tags deploy      # new MyToken instance each run
npx hardhat run scripts/test.ts --network sepolia       # transfer 100 MTK to a random address
npm run lesson bai6_1                                   # from repo ROOT — reads chain via PublicNode RPC
```

## Gotchas

- **Verification CLI is dead on Hardhat 2**: hardhat-verify froze at 2.1.3 (Etherscan V1 retired May 2025, Sourcify endpoints moved) → terminal verify fails with "deprecated endpoint" / `Unexpected token '<'`. Never suggest `@latest` bumps or `hardhat deploy --verify`. Manual web flow only: upload `deployments/sepolia/solcInputs/<hash>.json` as **Standard JSON Input** on Etherscan, drop the SAME file at repo.sourcify.dev — one file feeds both registries, no API keys, constructor args empty (the `ERC20("MyToken","MTK")` parent call is compile-time, not a constructor arg)
- **Incremental compile ghosts**: deleting a contract leaves empty `artifacts/**/` dirs and orphaned `typechain/*.ts`; deleting `typechain/` alone skips regeneration because `cache/` fingerprints make compile a no-op. Always `npx hardhat clean && npx hardhat compile` after removing contracts/folders by hand
- Test stack is installed explicitly (config imports plugins individually, no toolbox): chai pinned **v4** (v5 is ESM-only) — see root AGENTS setup for exact install line
- `scripts/test.ts` sends funds to `ethers.Wallet.createRandom().address` because Sepolia exposes exactly ONE signer (`getSigners()[1]` would be undefined)
- Cosmetic unfixed: `deploy/1-deploy.ts:14` still logs "Deploy Counter Contract"
- Redeploys mint fresh instances (`skipIfAlreadyDeployed: false`) and overwrite `deployments/sepolia/MyToken.json` — re-verify after redeploying
- Sepolia RPC is PublicNode (`https://ethereum-sepolia-rpc.publicnode.com`) in both `hardhat.config.ts` and lesson-level `test.ts`
