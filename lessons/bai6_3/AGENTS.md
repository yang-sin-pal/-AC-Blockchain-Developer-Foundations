# AGENTS.md — bai6_3 (MyNFT ERC721 + Hardhat)

Exercise spec: `README.md`. All Hardhat work happens in the shared repo-root `ac-hardhat-template/` — this lesson's payload (contract, tests, scripts) was merged into it; see root `AGENTS.md`.

Goal: ERC721 named "MyNFT" (symbol "MNFT"), onlyOwner `mint(address)` via `_safeMint` with auto-incrementing `nextTokenId`; deploy → mint #0 to deployer → print `ownerOf(0)`.

## Current state (verified)

- Lesson complete; payload lives in shared `ac-hardhat-template/`: `contracts/MyNFT.sol`, `test/MyNFT.test.ts`, `deploy/03-nft.ts` (tag `nft`), `scripts/nft.ts`
- Deployed on Sepolia: MyNFT at `0xDfee82bf1967A3110B7430B749a82ab2cFe9A960` (record `deployments/sepolia/MyNFT.json`, solcInputs recipe `10ee325bcfb15896ae394a973e77ccad.json`)
- Token ownership quirk: token #0 belongs to a burned random address `0x9C7ed3c680E9158f64A5D44bD49d4cEEef885Af1` (key discarded by an early random-mint run); token #1 onward belong to the deployer
- Template-wide suite: 13 tests green (2 Counter + 5 MyToken + 6 MyNFT); Etherscan auto-matched this exact bytecode (no manual verify needed)
- Report with screenshots: `solution.md` + `solution_images/`

## Commands

From repo-root `ac-hardhat-template/`:

```bash
npx hardhat test                                        # ALL accumulated unit tests (local network)
npx hardhat deploy --network sepolia --tags nft         # reuse-or-deploy MyNFT, mint, print ownerOf(0)
npx hardhat run scripts/nft.ts --network sepolia        # self-mint the next tokenId to deployer
```

From repo root:

```powershell
$env:TESTNET_PRIVATE_KEY = "<funded sepolia key>"; npm run lesson bai6_3   # standalone ethers v6 script
```

## Gotchas

- `getNamedAccounts()` returns STRING addresses — `.address` is undefined; pass the string directly to contract calls and `from:` (only Signers from `getSigners()` have `.address`)
- hardhat-deploy 1.x REUSES unchanged deployments even with `skipIfAlreadyDeployed: false` (prints `reusing "MyNFT" at …`) — delete `deployments/sepolia/MyNFT.json` first to force a fresh instance; remember `lessons/bai6_3/test.ts` embeds the address manually and would need rewiring after any redeploy
- OZ 5.x requires `evmVersion: "cancun"` (already pinned in config) — Hardhat 2's silent `paris` default breaks `mcopy`
