# PLAN — bai7_1 (MyMintableToken ERC20)

Spec: `README.md`. All template work happens in the shared repo-root `ac-hardhat-template/` — contracts accumulate alongside Counter + MyToken + MyNFT (see root `AGENTS.md`).

## Phase 0 — shared template ready

- [X] A. Template consolidated; Counter + MyToken + MyNFT coexist; 13 tests green
- [X] B. OpenZeppelin v5 present (ERC20 + Ownable already proven); `evmVersion: "cancun"` pinned; chai-matchers ^2 installed

## Phase 1 — payload into shared template

- [X] 1. Add `contracts/MyMintableToken.sol` — "MyMintableToken"/"MMT", ERC20 + Ownable, `mint(to, amount)` onlyOwner via `_mint`, no initial supply
- [X] 2. Add `test/MyMintableToken.test.ts` (name/symbol · zero initial supply · owner mint → balance + Transfer event · non-owner revert OwnableUnauthorizedAccount · mints accumulate)
- [X] 3. Add `deploy/04-mymintabletoken.ts` (tag `mmt`: deploy → mint 1000 MMT to deployer → print raw + formatted balance) + `scripts/mmt.ts` (mint another 100, print balances)
- [X] 4. From `ac-hardhat-template/`: `npx hardhat clean && npx hardhat compile && npx hardhat test` → **19 passing** (2 Counter + 5 MyToken + 6 MyNFT + 6 MyMintableToken)

## Phase 2 — Sepolia

- [X] 5. `npx hardhat deploy --network sepolia --tags mmt` → fresh MyMintableToken at `0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82`, minted 1000 MMT, balance printed
- [X] 6. Verification DEFERRED to bài 7.2 by scope decision — manual Phase K flow + Etherscan owner/non-owner function calls happen there (solcInputs recipe ready: `999f835e6a53cc806b1cec02f4c86694.json`)
- [X] 7. `npx hardhat run scripts/mmt.ts --network sepolia` as owner (1000 → 1100 MMT) AND as faucet-funded burner via session `$env:TESTNET_PRIVATE_KEY` override → `OwnableUnauthorizedAccount` revert captured

## Phase 3 — report + docs

- [X] 8. Screenshots → `solution_images/` (user) → `solution.md` report (Vietnamese, house format; unit-test section omitted per user preference)
- [X] 9. Root AGENTS.md gains bai7_1 notes; write `lessons/bai7_1/AGENTS.md` at completion
