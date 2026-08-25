# PLAN — bai6_3 (MyNFT ERC721)

Spec: `README.md`. All template work happens in the shared repo-root `ac-hardhat-template/` — contracts accumulate alongside Counter + MyToken (see root `AGENTS.md`).

## Phase 0 — shared template ready

- [X] A. Template consolidated at repo root; Counter + MyToken coexist; all suites green
- [X] B. OpenZeppelin v5 present (ERC721 + Ownable available), typechain regenerates on compile
- [X] C. Verification recipe proven (manual web flow, solcInputs standard-json feeds both registries)

## Phase 1 — payload into shared template

- [X] 1. Add `contracts/MyNFT.sol` — delete nothing (accumulation model)
- [X] 2. Add `test/MyNFT.test.ts` (name/symbol/nextTokenId start · mint→ownerOf(0) · increment · non-owner revert)
- [X] 3. Add `deploy/03-nft.ts` (tag `nft`: deploy → mint #0 → print ownerOf(0)) + `scripts/nft.ts`
- [X] 4. From `ac-hardhat-template/`: `npx hardhat clean && npx hardhat compile && npx hardhat test` → **13 passing** (2 Counter + 5 MyToken + 6 MyNFT)

## Phase 2 — Sepolia

- [X] 5. `npx hardhat deploy --network sepolia --tags nft` → note printed MyNFT address + `ownerOf(0)`
- [X] 6. Verify manually per `ac-hardhat-template/GUIDE.md` Phase K: fresh `deployments/sepolia/solcInputs/<hash>.json` → Etherscan **Standard JSON Input** → same file at repo.sourcify.dev → Perfect Match
- [X] 7. `npx hardhat run scripts/nft.ts --network sepolia` → mints #1 to a random address, prints owner

## Phase 3 — lesson script + report

- [X] 8. Finish `lessons/bai6_3/test.ts`: PublicNode RPC, ERC721 read/mint ABI, paste deployed address; mints via `$env:TESTNET_PRIVATE_KEY` signer (payload already staged by agent)
- [X] 9. Run from repo ROOT: `$env:TESTNET_PRIVATE_KEY="<key>"` then `npm run lesson bai6_3` → prints `MyNFT (MNFT)`, `Minted tokenId N`, `Owner: 0x…`
- [X] 10. Screenshots → `solution_images/` (user) → `solution.md` report
- [X] 11. Root AGENTS.md gains bai6_3 notes; write `lessons/bai6_3/AGENTS.md` at completion
