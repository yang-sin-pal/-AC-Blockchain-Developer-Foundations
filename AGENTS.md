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

## Reports (`solution.md`)

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
2. Capture screenshots showing deployed contract and function call results
3. Save `.png` files in the same lesson folder
4. Create/edit `solution.md` referencing them with markdown image syntax

## Lessons 7+
`bai7_1` and `bai7_2` use **Hardhat** for Solidity contracts (separate setup, not TypeScript tests).
