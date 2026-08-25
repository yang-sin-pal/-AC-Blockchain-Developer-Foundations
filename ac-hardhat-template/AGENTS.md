# AGENTS.md — ac-hardhat-template (shared Hardhat 2 workspace)

Self-contained workspace shared by ALL Hardhat lessons (bai5_2 … bai7_2) — never clone or copy it per lesson; contracts / tests / deploy-scripts / interaction-scripts accumulate here. Deep guide: `GUIDE.md` (concepts + build phases + reference). Install dependencies only ever with `npm install --legacy-peer-deps`.

## Deployment registry (sepolia)

Records in `deployments/sepolia/*.json` are load-bearing: other lessons' scripts resolve live addresses via `ethers.getContract(...)` against them, and `solcInputs/<hash>.json` are the manual-verification recipes — do not prune either.

| Contract | Address | Deploy tag | Verification status |
|---|---|---|---|
| Counter | `0xb656c0ce3B333Ad0F9486CfB9Fed2BF4944A3351` | `counter` | manual: Etherscan + Sourcify |
| MyToken | `0x82AAcD5Be037A483Fc3E0cC5f2B65747A18Ab595` | `mytoken` | manual: Etherscan + Sourcify |
| MyNFT | `0xDfee82bf1967A3110B7430B749a82ab2cFe9A960` | `nft` | Etherscan auto-match |
| MyMintableToken | `0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82` | `mmt` | Etherscan auto Similar Match |

## Commands (order matters)

```bash
npx hardhat clean && npx hardhat compile   # REQUIRED after any contract change/addition/deletion
npx hardhat test                           # ALL accumulated suites — currently 19 passing
npx hardhat deploy --network sepolia --tags <counter|mytoken|nft|mmt>
npx hardhat run scripts/<counter|token|nft|mmt>.ts --network sepolia
```

- Compile regenerates `typechain/` + `data/abi/` for ALL accumulated contracts; tests/scripts import TypeChain types (`import { MyNFT } from "../typechain"`)
- Deleting contract files without `clean` leaves ghost artifacts — cache fingerprints make a plain compile a no-op

## Hard-won quirks

- **`evmVersion: "cancun"` is pinned** — HH2 otherwise silently compiles as `paris`, which OZ 5.x utils reject (`mcopy` opcode). Pre-MyNFT deployments were paris-era and verify via their own frozen solcInputs snapshots.
- **Verification CLI is dead**: HH2 freezes `hardhat-verify` at 2.x and Etherscan's V1 API retired May 2025 — never suggest `npx hardhat verify`, `--verify`, or version bumps. Manual web flow only: upload the matching `deployments/sepolia/solcInputs/<hash>.json` as **Standard JSON Input** on Etherscan; Sourcify optionally takes the same file independently.
- **Etherscan auto-verifies matching bytecode** (Similar Match ignores ctor args, Exact Match includes them) — deploys of these shapes often arrive pre-verified; later resubmission then hits the "Source code already verified" wall.
- **hardhat-deploy 1.x REUSES unchanged deployments even with `skipIfAlreadyDeployed: false`** — it replays the stored deployment transaction and dedupes when artifact + args match (`reusing "X" at …`). For a genuinely fresh instance, delete `deployments/sepolia/<Name>.json` first, then rewire any dependent scripts and re-verify.
- **`getNamedAccounts()` returns STRING addresses** — `.address` on them is undefined; pass the string directly into calls and `from:`. Only Signers from `getSigners()` have `.address`.
- **TypeChain inference needs an annotation**: `const nft: MyNFT = await ethers.getContract("MyNFT", signer)` — otherwise editors show `BaseContract` squiggles (runtime is fine either way under ts-node transpileOnly).
- **Test stack is explicit despite toolbox**: config imports plugins individually; `hardhat-toolbox@3` sits unused in devDeps — don't rely on toolbox auto-imports. chai v4 (v5 is ESM-only); `@nomicfoundation/hardhat-chai-matchers` ^2 (v1 peers ethers ^5) must be imported in every test file that uses matchers.
- **Exactly one signer exists on sepolia** (`accounts: [TESTNET_PRIVATE_KEY]`) — second accounts come from `ethers.Wallet.createRandom()` plus faucet-funded ETH. `dotenv.config()` never overrides pre-set env vars, so a session-level `$env:TESTNET_PRIVATE_KEY = <burner key>` beats `.env` for one window (burner demos without editing files).
- **Per-contract tags only** (`func.tags = ["counter" | "mytoken" | "nft" | "mmt"]`) — never reintroduce a shared `"deploy"` tag: it would execute ALL payloads every run.
- `.env` keys: `TESTNET_PRIVATE_KEY` (funded), `MAINNET_PRIVATE_KEY` (placeholder `0x0...0` satisfies config validation even though `.env_example` omits it), `ETHERSCAN_API`; all RPCs are PublicNode.
