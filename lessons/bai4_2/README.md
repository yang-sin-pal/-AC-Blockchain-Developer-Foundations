# Lesson 4.2 – Modifier, Event, and Access Control

## 🎯 Objectives
- Practice writing a modifier to restrict owner permissions.
- Log events when adding data.

## 📄 Problem
Write a smart contract `StudentRegistryV2` extending lesson 4.1:
- Only the owner (the contract deployer) is allowed to add students.
- When a student is added successfully, emit an event.

## 💻 How to Run
- Paste the code into Remix IDE: https://remix.ethereum.org
- Deploy → Test `registerStudent()`, check the event log and the student read result.
