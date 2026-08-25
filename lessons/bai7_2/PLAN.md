# PLAN — bai7_2 (Verify MyMintableToken on Etherscan)

Spec: `README.md`. No template payload of its own — reuses bai7_1's MyMintableToken (see root `AGENTS.md`). This lesson is verification + Etherscan interaction only.

## Phase 0 — inherited prerequisites

- [X] A. Plugin/config ready in `ac-hardhat-template/hardhat.config.ts`: `hardhat-verify` imported, `etherscan.apiKey` wired to `$ETHERSCAN_API`, sourcify enabled
- [X] B. MyMintableToken live at `0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82` (bai7_1); solcInputs recipe `999f835e6a53cc806b1cec02f4c86694.json` staged

## Phase 1 — verification reality

- [X] 1. README Step 4 (`npx hardhat verify`) documented dead: HH2 freezes hardhat-verify at 2.x while Etherscan's V1 API retired May 2025 — narrated textually in the report per user choice (no failure screenshot)
- [X] 2. Etherscan AUTO-VERIFIED the contract as **Similar Match** before any manual submission → source + Read/Write tabs public (`1_the_contrat_autoverified_by_similar_contract.png`)
- [X] 3. Read Contract tab: `balanceOf(owner)` (`2_view_balanceOf_owner_with_readContract.png`)
- [X] 4. Write Contract tab: `mint` as owner succeeds (`3_perform_mint_Owner.png`); balance re-check confirms growth (`4_check_balance_again.png`)

## Phase 2 — non-owner proof

- [X] 5. Connect burner wallet on the Write tab → `mint` → expected revert/Fail captured (`5_perform_mint_NonOwner_expectedRevertOrFail.png`)

## Phase 3 — docs

- [X] 6. `solution.md` report (house format; no unit-test section) with deliverables box: address + Etherscan code link + verification screenshot
- [X] 7. Root AGENTS specifics line += bai7_2; write `lessons/bai7_2/AGENTS.md`

Scope decisions: Sourcify skipped (user choice); CLI-failure screenshot skipped (textual note instead).
