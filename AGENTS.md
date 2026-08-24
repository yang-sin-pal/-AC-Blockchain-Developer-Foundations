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
| Hardhat | bai5_2, bai5_3, bai6_1, bai6_3, bai7_1, bai7_2 | stub `test.ts`; all work happens inside `ac-hardhat-template/` |

Only **bai5_2** currently has an `ac-hardhat-template/` folder. For the other Hardhat lessons, clone it from https://github.com/appscyclone/ac-hardhat-template before any work. See `lessons/bai5_2/AGENTS.md` for lesson specifics.

## Dependencies

- Root: `ethers` v6, `ts-node`, TypeScript, `@types/node`
- Root tsconfig: `target: ESNext`, `module/moduleResolution: Node16`, `strict`
- Each `ac-hardhat-template/` is self-contained: own tsconfig (`commonjs` / `es2020`), own node_modules

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

## Hardhat lessons (bai5_2, bai5_3, bai6_1, bai6_3, bai7_1, bai7_2)

All Hardhat commands run **inside** `lessons/<name>/ac-hardhat-template/` — never from repo root.

### Setup (first time)

```bash
cd lessons/<name>/ac-hardhat-template

# Fix: --legacy-peer-deps avoids hardhat-toolbox v3 ↔ hardhat-verify v2 conflict
npm install --legacy-peer-deps

# If missing, install typechain separately
npm install --legacy-peer-deps --save-dev typechain@^8.3.2

# Create .env (add real TESTNET_PRIVATE_KEY for Sepolia deployment)
copy .env_example .env

# Compile → generates typechain/ (fixes import "../typechain" errors)
npx hardhat compile
```

### Commands

| Command | Description |
|---|---|
| `npx hardhat test` | Run unit tests (local Hardhat network) |
| `npx hardhat deploy --network sepolia --tags deploy` | Deploy to Sepolia |
| `npx hardhat run scripts/test.ts --network sepolia` | Run interaction script |
| `npx hardhat node` | Run local Hardhat network |

### Notes

- Fresh template clones ship dead BlastAPI RPC URLs and a placeholder dev key: replace `networks.sepolia.url` (e.g. `https://ethereum-sepolia-rpc.publicnode.com`) and set a funded real `TESTNET_PRIVATE_KEY` before deploying
- Order matters: run `npx hardhat compile` before tests/scripts whenever contracts changed or typechain is missing; compile also re-exports ABIs to `data/abi/`
- Deploys use hardhat-deploy (`deploy/*.ts`, tag `deploy`, named account `deployer` = account index 0)
- `.env_example` has no `MAINNET_PRIVATE_KEY`, but `hardhat.config.ts` reads it — if you get `.env` validation errors, add placeholder `MAINNET_PRIVATE_KEY=0x0...0`
- Never commit `.env` (root `.gitignore` already ignores it)
