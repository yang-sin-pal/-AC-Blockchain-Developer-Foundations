# Blockchain Course — Final Year Project

All 14 course exercises (Solidity, Hardhat, Ethers.js) completed across the `lessons/` folder and the shared `ac-hardhat-template/` workspace.

---

## Reports

Click any solution link to jump directly to the deliverable.

| # | Lesson | Topic | Solution | Type |
|---|--------|-------|----------|------|
| 1 | `bai1_1` | Block Validation (SHA-256 hashing) | [solution.ts](lessons/bai1_1/solution.ts) | Automated (TypeScript) |
| 2 | `bai2_1` | Smart Contract Simulation (TypeScript) | [solution.ts](lessons/bai2_1/solution.ts) | Automated (TypeScript) |
| 3 | `bai2_3` | Welcome Contract (Solidity + Remix) | [solution.md](lessons/bai2_3/solution.md) | Remix IDE |
| 4 | `bai3_1` | Data Types & Variables (`string`, `uint`) | [solution.md](lessons/bai3_1/solution.md) | Remix IDE |
| 5 | `bai3_2` | Functions, Control Flow & Access Control | [solution.md](lessons/bai3_2/solution.md) | Remix IDE |
| 6 | `bai4_1` | Struct, Mapping & Array | [solution.md](lessons/bai4_1/solution.md) | Remix IDE |
| 7 | `bai4_2` | Modifier, Event & Access Control | [solution.md](lessons/bai4_2/solution.md) | Remix IDE |
| 8 | `bai4_3` | Voting Contract (Week 4 Capstone) | [solution.md](lessons/bai4_3/solution.md) | Remix IDE |
| 9 | `bai5_2` | Counter + Hardhat + Ethers.js | [solution.md](lessons/bai5_2/solution.md) | Hardhat + Sepolia |
| 10 | `bai5_3` | ABI-Based Contract Interaction | [solution.md](lessons/bai5_3/solution.md) | Ethers.js Script |
| 11 | `bai6_1` | ERC-20 Token (`MyToken`) | [solution.md](lessons/bai6_1/solution.md) | Hardhat + Sepolia |
| 12 | `bai6_3` | NFT (`MyNFT` ERC-721) | [solution.md](lessons/bai6_3/solution.md) | Hardhat + Sepolia |
| 13 | `bai7_1` | Mintable ERC-20 Token (`MyMintableToken`) | [solution.md](lessons/bai7_1/solution.md) | Hardhat + Sepolia |
| 14 | `bai7_2` | Etherscan Contract Verification | [solution.md](lessons/bai7_2/solution.md) | Etherscan Web UI |

### Deployed Contracts (Sepolia)

| Contract | Address | Etherscan |
|---|---|---|
| Counter | `0xb656c0ce3B333Ad0F9486CfB9Fed2BF4944A3351` | [View](https://sepolia.etherscan.io/address/0xb656c0ce3B333Ad0F9486CfB9Fed2BF4944A3351) |
| MyToken (ERC-20) | `0x82AAcD5Be037A483Fc3E0cC5f2B65747A18Ab595` | [View](https://sepolia.etherscan.io/address/0x82AAcD5Be037A483Fc3E0cC5f2B65747A18Ab595) |
| MyNFT (ERC-721) | `0xDfee82bf1967A3110B7430B749a82ab2cFe9A960` | [View](https://sepolia.etherscan.io/address/0xDfee82bf1967A3110B7430B749a82ab2cFe9A960) |
| MyMintableToken (ERC-20) | `0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82` | [View](https://sepolia.etherscan.io/address/0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82) |

---

## What I Learned

### Phase 1 — Blockchain Fundamentals (`bai1_1`)

Implemented `isValidBlock()` in TypeScript to verify block integrity via SHA-256 hashing. This grounded the core idea — chain tampering is detectable — before touching any Solidity.

### Phase 2 — Bridging to Solidity (`bai2_1`, `bai2_3`)

Built a `SmartContract` TypeScript class simulating on-chain state, then compiled and deployed a real `Welcome` contract on Remix IDE. The shift from mental model to deployed code made constructors, public state variables, and `msg.sender` concrete.

### Phase 3 — Solidity Core Building Blocks (`bai3_1`, `bai3_2`)

Wrote contracts using `string`/`uint` types, setter functions, `require()` guards, `if/else` control flow, and access control via `msg.sender` checks. Each concept layered onto the previous one.

### Phase 4 — Intermediate Patterns (`bai4_1`, `bai4_2`, `bai4_3`)

Composed `struct`, `mapping(address => ...)`, custom `modifier`, and `Event` into a `StudentRegistryV2`, then combined everything into a `Voting` contract that prevents duplicate votes. This was the first time multiple patterns had to work together in a single contract.

### Phase 5 — Professional Toolchain (`bai5_2`, `bai5_3`)

Shifted from Remix to Hardhat: wrote deploy scripts, unit tests, and Ethers.js interaction scripts. Deployed `Counter` to Sepolia, called `increment()` from a standalone script, and learned how ABIs, providers, and signers power frontend-blockchain communication.

### Phase 6 — Token Standards (`bai6_1`, `bai6_3`)

Implemented an ERC-20 token (`MyToken`, 1 MTK supply) and an ERC-721 NFT (`MyNFT`, owner-only mint with auto-increment) using OpenZeppelin v5. Deployed both to Sepolia with automated test suites, and learned Hardhat-specific quirks: `evmVersion` pinning, `hardhat-deploy` reuse semantics, and dead verification CLI workarounds.

### Phase 7 — Verification & Ownership Flows (`bai7_1`, `bai7_2`)

Built a mintable ERC-20 (`MyMintableToken`) with owner-gated `mint()` and non-owner revert proof, then verified it on Etherscan via the manual Standard JSON Input flow (since the CLI path is dead). Interacted directly with the Read/Write Contract tabs to confirm on-chain behavior independently of any script.

### Skills Summary

The course progresses from **"what is a block?"** to **"I can independently write, deploy, test, verify, and interact with live smart contracts on a public testnet."** Across 14 exercises, the accumulated skills include: SHA-256 hashing and block validation, Solidity syntax and patterns (types, functions, modifiers, events, structs, mappings), ERC-20 and ERC-721 token standards via OpenZeppelin, the Hardhat build/deploy/test pipeline, Ethers.js for on-chain interaction, automated unit testing with Chai matchers, Etherscan source verification (manual web flow), and handling real-world toolchain quirks that official documentation omits.
