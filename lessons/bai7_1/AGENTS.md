# AGENTS.md — bai7_1 (MyMintableToken ERC20 + Hardhat)

Exercise spec: `README.md`. All Hardhat work happens in the shared repo-root `ac-hardhat-template/` — this lesson's payload (contract, tests, scripts) was merged into it; see root `AGENTS.md`.

Goal: mintable ERC20 named "MyMintableToken" (symbol "MMT"), onlyOwner `mint(address,uint256)` via `_mint`, no initial supply; deploy → mint 1000 to deployer → print balance.

## Current state (verified)

- Lesson complete; payload lives in shared `ac-hardhat-template/`: `contracts/MyMintableToken.sol`, `test/MyMintableToken.test.ts`, `deploy/04-mymintabletoken.ts` (tag `mmt`), `scripts/mmt.ts`
- Deployed on Sepolia: MyMintableToken at `0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82` (record `deployments/sepolia/MyMintableToken.json`; solcInputs recipe `999f835e6a53cc806b1cec02f4c86694.json`)
- NOT verified on any registry yet — deliberately deferred to bai7_2, which also demos Etherscan `mint` calls as owner vs non-owner
- Template-wide suite: 19 tests green (2 Counter + 5 MyToken + 6 MyNFT + 6 MyMintableToken)
- Report with screenshots: `solution.md` + `solution_images/`

## Commands

From repo-root `ac-hardhat-template/`:

```bash
npx hardhat test                                        # ALL accumulated unit tests (local network)
npx hardhat deploy --network sepolia --tags mmt         # reuse-or-deploy, mint 1000 MMT, print balance
npx hardhat run scripts/mmt.ts --network sepolia        # mint another 100 MMT to deployer
```

Non-owner demo without touching `.env` — fund a burner wallet from a faucet, then in one PowerShell window:

```powershell
$env:TESTNET_PRIVATE_KEY = "<burner key>"; npx hardhat run scripts/mmt.ts --network sepolia   # expect OwnableUnauthorizedAccount revert
```

## Gotchas

- `dotenv.config()` never overrides pre-set env vars — a session-level `$env:TESTNET_PRIVATE_KEY` beats `.env` for that window only; restore with `Remove-Item Env:\TESTNET_PRIVATE_KEY` or a fresh window
- The burner needs faucet-funded Sepolia ETH first, otherwise the tx dies with `insufficient funds` instead of the expected revert
- Standing template gotchas apply unchanged: `getNamedAccounts()` returns string addresses; hardhat-deploy 1.x reuses unchanged deployments even with `skipIfAlreadyDeployed: false`
