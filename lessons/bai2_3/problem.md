# Lesson 2.2 – Writing a Simple Solidity Function

## 🎯 Objectives
- Get familiar with basic Solidity syntax.
- Write a simple smart contract with variables and functions.
- Deploy and test it on Remix IDE.

## 📄 Problem Statement
Write a smart contract named `Welcome`:
- A `string` variable `greeting`, declared as `public`.
- A constructor that takes an initial value for `greeting`.
- A `getGreeting()` function that returns `greeting`.

Then:
1. Deploy the contract on Remix IDE.
2. Call the `getGreeting()` function and take a screenshot of the result.
3. (Optional) Modify the function to also return the deployer's address (`msg.sender`).

## 💡 Implementation Hints
- Paste into Remix at: https://remix.ethereum.org
- Select compiler 0.8.x
- Deploy the contract using the injected provider or the VM environment
