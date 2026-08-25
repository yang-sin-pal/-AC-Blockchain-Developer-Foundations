# Lesson 3.1 – Solidity Data Types and Variables

## 🎯 Objectives
- Practice declaring variables in Solidity
- Use data types: string, uint
- Learn how to write a function that updates a state variable

## 📄 Problem
Write a smart contract named `Profile`:
- Variable `name` (type `string`) declared as `public`
- Variable `age` (type `uint`) declared as `public`
- Function `setProfile(string _name, uint _age)` updates name and age

Then:
1. Deploy the contract on Remix IDE
2. Call `setProfile("Alice", 21)`
3. Call `name()` and `age()` to verify the results

## 🛠 Implementation
- Open https://remix.ethereum.org
- Create a file `Profile.sol`, paste the code in
- Compile and Deploy
- Test the functions in Remix IDE
