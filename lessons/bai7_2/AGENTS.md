# AGENTS.md — bai7_2 (Verify MyMintableToken on Etherscan)

Exercise spec: `README.md`. No template payload of its own — reuses bai7_1's MyMintableToken; see root `AGENTS.md`.

Goal: get MyMintableToken publicly verified on Sepolia Etherscan and exercise its Read/Write tabs as owner vs non-owner.

## Current state (verified)

- MyMintableToken at `0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82` is **auto-verified on Etherscan as Similar Match** — bytecode matched an existing verified deployment before any manual submission; source + Read/Write tabs are public
- On-chain interaction proven through the Write tab: owner `mint` succeeded, burner `mint` reverted with `OwnableUnauthorizedAccount` — both captured in `solution_images/`
- Report with screenshots: `solution.md` + `solution_images/`
- Sourcify deliberately skipped (scope decision; solcInputs recipe stays staged at `deployments/sepolia/solcInputs/999f835e6a53cc806b1cec02f4c86694.json`)

## Notes / Gotchas

- Never suggest `npx hardhat verify` on this toolchain — HH2 freezes hardhat-verify at 2.x and Etherscan's V1 API (which that CLI calls) was retired May 2025
- Similar-Match pages generally refuse manual resubmission ("Source code already verified"); an Exact Match upgrade attempt would go through the manual web flow with the solcInputs recipe above — expect the already-verified wall
- Etherscan Write-tab calls need the wallet connected AND gas-funded; non-owner mints show Fail status, with or without the custom error decoded depending on match metadata
