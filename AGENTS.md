# AGENTS.md — Blockchain Course Template

## Run a lesson

```bash
npm run lesson bai1_1
```

or directly:

```bash
npx ts-node run.ts bai1_1
```

`run.ts` just dynamically imports `lessons/<name>/test.ts`. For Remix and Hardhat lessons this only prints a "test manually" reminder.

## Commands

- `npm run lesson <name>` — run a lesson's tests (root level)
- `npm test` — placeholder; exits 1 (no tests at root)
- No lint or typecheck scripts exist at the root

## Lesson types

| Type | Lessons | Structure |
|---|---|---|
| TypeScript | bai1_1, bai2_1 | `problem.md`, `solution.ts` (edit this only), `test.ts` (automated assertions, do NOT edit) |
| Remix IDE | bai2_3 – bai4_3 | stub `test.ts`; solution = `.sol` file(s) + `solution.md` report (bai4_x use `README.md` instead of `problem.md`) |
| Script + report | bai5_3 | `README.md` spec; turn the stub `test.ts` into a working ethers v6 script against an already-deployed contract (reuses bai5_2's Counter); finish with a `solution.md` report |
| Hardhat | bai5_2, bai6_1, bai6_3, bai7_1, bai7_2 | stub `test.ts`; all work happens in the shared repo-root `ac-hardhat-template/` |

One **shared** template lives at repo-root `ac-hardhat-template/` (already installed: node_modules present, funded `.env` ready) — never clone or copy it per lesson. Each Hardhat lesson just adds its payload files there; see `lessons/bai5_2/AGENTS.md`, `lessons/bai6_1/AGENTS.md`, `lessons/bai6_3/AGENTS.md` and `lessons/bai7_1/AGENTS.md` for lesson specifics.

## Dependencies

- Root: `ethers` v6, `ts-node`, TypeScript, `@types/node`
- Root tsconfig: `target: ESNext`, `module/moduleResolution: Node16`, `strict`
- The shared root `ac-hardhat-template/` is self-contained: own tsconfig (`es2022` / Node16), own node_modules (install only ever with `--legacy-peer-deps`)

## Reports (`solution.md`)
Prerequisite: only when user requests to make a report.
Remix lessons (bai2_3 – bai4_3) are done manually on Remix IDE; their `test.ts` only prints `"Test this contract manually in Remix IDE."`

### Workflow

1. Complete the Solidity exercise on Remix IDE
2. Capture screenshots showing deployed contract and function call results (user does this)
3. Save `.png` files in a `solution_images/` subfolder of the lesson folder (user does this)
4. Create/edit `solution.md` referencing them with markdown image syntax

### Report format

```
# Bài {X}.{Y} – Báo cáo
#### 1. {Step description}
![alt text](solution_images/screenshot_file.png)
![alt text](solution_images/screenshot_file2.png)
#### 2. {Next step}
...
```

### Screenshot naming

Use descriptive **kebab-case** names, e.g.:

- `implement_getGreeting_string.png`
- `call_getGreeting_string.png`
- `change_getGreeting_address.png`

## Hardhat lessons (bai5_2, bai6_1, bai6_3, bai7_1, bai7_2)

All Hardhat commands run **inside** repo-root `ac-hardhat-template/`. Contracts, tests, deploy-scripts and interaction scripts **accumulate** there per lesson (currently Counter + MyToken + MyNFT). The template is fully installed — `.env` holds the funded Sepolia key, all configured RPCs are PublicNode.

Only rebuild after adding/changing files:

```bash
cd ac-hardhat-template
npx hardhat clean && npx hardhat compile   # regenerates typechain/ + data/abi/ for ALL contracts
```

### Commands

| Command | Description |
|---|---|
| `npx hardhat test` | Run ALL accumulated unit tests (local network) |
| `npx hardhat deploy --network sepolia --tags <tag>` | Deploy one contract — tag = `counter`, `mytoken`, … |
| `npx hardhat run scripts/counter.ts --network sepolia` | Counter interact: increment() + getCount() |
| `npx hardhat run scripts/token.ts --network sepolia` | MyToken: transfer 100 MTK to a random address |
| `npx hardhat run scripts/nft.ts --network sepolia` | MyNFT: self-mint the next tokenId to deployer |
| `npx hardhat run scripts/mmt.ts --network sepolia` | MyMintableToken: mint another 100 MMT to deployer |
| `npx hardhat node` | Run local Hardhat network |

### Notes

- Lesson-level `test.ts` scripts embed placeholder ABIs/addresses until solved (verified in bai5_3, bai6_1, bai6_3) — fix before running
- Deploys use hardhat-deploy (`deploy/NN-<name>.ts`) with **per-contract tags** (`func.tags = ["counter" | "mytoken" | …]`) — never reintroduce a shared `"deploy"` tag: it would execute ALL accumulated deploy scripts on every run (hardhat-deploy 1.x reuses unchanged ones, but any changed contract or missing record gets deployed unintentionally)
- Test stack is explicit (no toolbox): chai pinned v4 (v5 is ESM-only), `@nomicfoundation/hardhat-chai-matchers` pinned ^2.x — v1.x declares peer ethers ^5 and misbehaves under ethers v6; import it in any test file using matchers
- Deployment records are load-bearing: `deployments/sepolia/*.json` hold live addresses that other lessons/scripts resolve via `ethers.getContract(...)`, and `deployments/sepolia/solcInputs/<hash>.json` are the verification recipes for both registries — do not prune them
- Contract verification is manual web-flow only on Hardhat 2 (the verify CLI is dead on this toolchain) — full recipe in `ac-hardhat-template/GUIDE.md` Phase K (merged guide: concepts + build phases + reference; supersedes the old lessons/bai6_1/BUILD_TEMPLATE.md and lessons/bai5_2/TUTORIAL.md, both deleted)
- `evmVersion: "cancun"` is pinned in the template config — Hardhat 2 otherwise silently compiles as `paris`, which modern OZ 5.x utils reject (`mcopy` opcode); pre-MyNFT deployments were paris and verify via their own frozen solcInputs snapshots
- Order matters: run compile before tests/scripts whenever contracts changed or typechain is missing
- `.env_example` has no `MAINNET_PRIVATE_KEY`, but `hardhat.config.ts` reads it — if you get `.env` validation errors, add placeholder `MAINNET_PRIVATE_KEY=0x0...0`
- Never commit `.env` (root `.gitignore` already ignores it)
