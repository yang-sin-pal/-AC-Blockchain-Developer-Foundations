# AGENTS.md — Blockchain Course Template

## Run a lesson

```bash
npm run lesson bai1_1
```

or directly:

```bash
npx ts-node run.ts bai1_1
```

## Lesson structure

`lessons/bai{X}_{Y}/` contains:

- `solution.ts` — edit this only
- `test.ts` — do NOT edit (console.log-based assertions, no test framework)
- `problem.md` — instructions in Vietnamese

## Commands

- `npm run lesson <name>` — run a lesson's tests
- `npm test` — placeholder (no tests at root)

## Dependencies

- `ethers` v6, `ts-node`, TypeScript, `@types/node`
- tsconfig: `ESNext` / `CommonJS` / `strict`

## Reports (`solution_report.md`)
Prerequisite: only when user request to make a report.
Some Solidity/Remix IDE lessons (currently `bai2_3`) use a manual report file (`solution.md`) instead of TypeScript code.

### When to use

Use `solution.md` when the lesson's `test.ts` only prints `"Test this contract manually in Remix IDE."` — i.e., the exercise is done entirely on **Remix IDE**, not in TypeScript.

### Report format

```
# Bài {X}.{Y} – Báo cáo
#### 1. {Step description}
![alt text](screenshot_file.png)
![alt text](screenshot_file2.png)
#### 2. {Next step}
...
```

### Screenshot naming

Use descriptive **kebab-case** names, e.g.:

- `implement_getGreeting_string.png`
- `call_getGreeting_string.png`
- `change_getGreeting_address.png`

### Workflow

1. Complete the Solidity exercise on Remix IDE
2. Capture screenshots showing deployed contract and function call results (user do it)
3. Save `.png` files in the same lesson folder (user do it)
4. Create/edit `solution_report.md` referencing them with markdown image syntax (only when user request)

## Hardhat lessons (bai5_2, bai5_3, bai6_1, bai6_3, bai7_1, bai7_2)

Each lesson has an `ac-hardhat-template/` folder (cloned from `https://github.com/appscyclone/ac-hardhat-template`).

### Setup

```bash
cd lessons/<name>/ac-hardhat-template

# Fix: --legacy-peer-deps avoids hardhat-toolbox v3 ↔ hardhat-verify v2 conflict
npm install --legacy-peer-deps

# If missing, install typechain separately
npm install --legacy-peer-deps --save-dev typechain@^8.3.2

# Create .env (add real private keys for Sepolia deployment)
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

- `import { Counter } from "../typechain"` only works **after** `npx hardhat compile`
- `.env` requires `TESTNET_PRIVATE_KEY` (Sepolia) and `MAINNET_PRIVATE_KEY` (optional)
- Use `--legacy-peer-deps` for `npm install` to work around peer dependency conflict
- If you get `.env` validation errors, add placeholder `MAINNET_PRIVATE_KEY=0x0...0`
