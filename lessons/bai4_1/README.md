# Lesson 4.1 – Mapping, Struct, Array

## 🎯 Objectives
- Practice storing data using struct and mapping.
- Learn how to add, read, and check data in a smart contract.

## 📄 Problem
Write a smart contract named `StudentRegistry`:
- Create a `Student` struct containing: `name (string)`, `age (uint)`, `isRegistered (bool)`
- Use `mapping(address => Student)` to store each person's information by wallet address.
- The `register(string name, uint age)` function allows the caller to register themselves.
- The `getStudent(address user)` function returns the student's information.
- The `isStudentRegistered(address user)` function returns true/false indicating whether the student has registered.

## 💻 How to Run
- Paste the code into Remix IDE: https://remix.ethereum.org
- Deploy, then test each function sequentially.
- Try calling `register()`, `getStudent()` and `isStudentRegistered()`.
