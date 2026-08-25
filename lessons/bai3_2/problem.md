# Lesson 3.2 – Functions, Control Flow, and Visibility

## 🎯 Objectives
- Practice defining Solidity functions.
- Use require, if/else, return, visibility.
- Understand how to validate data in a smart contract.

## 📄 Problem
Write a smart contract named `VotingEligibility`:
- Variable `minAge` of type uint, initialized to 18.
- Function `checkEligibility(uint age)` returns true/false:
  - If `age >= minAge` → return true.
  - Otherwise → return false.
- Function `updateMinAge(uint newMinAge)`:
  - Only the deployer can call it (use require with `msg.sender`).
  - Update `minAge`.

## 💻 How to Run
- Paste into Remix IDE: https://remix.ethereum.org
- Deploy, then test `checkEligibility()` and `updateMinAge()`
