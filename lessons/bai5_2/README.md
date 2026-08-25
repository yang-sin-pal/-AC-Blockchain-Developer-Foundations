# Exercise 5.2 – Sending Transactions with Ethers.js + Hardhat

🎯 Objectives:

- Deploy a simple smart contract using Hardhat.
- Call the `increment()` function on the contract using Ethers.js.
- Print the result of `getCount()` to the console.

---

## ✅ Requirements

1. Use ac-hardhat-template: https://github.com/appscyclone/ac-hardhat-template
2. Study and understand the following:

   - Contract deploy script: deploy/1-deploy.ts
   - Counter contract interaction script: scripts/test.ts
   - Unit test script: test/Counter.test.ts

---

## 🧪 Testing

Run:

```bash
npx hardhat test # run unit tests before deploying (note: NOT "npx hardhat run test")
npx hardhat deploy --network sepolia --tags deploy # deploy to the Sepolia network
npx hardhat run scripts/test.ts --network sepolia
```

Expected result:

- The number `1` is displayed if `increment()` is called successfully once.
