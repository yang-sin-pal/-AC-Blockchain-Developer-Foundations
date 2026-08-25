# Lesson 4.3 – Voting Smart Contract

## 🎯 Objectives
- Practice the comprehensive week 4 assignment.
- Combine struct, mapping, modifier, and event to build a voting contract.

## 📄 Problem
Write a smart contract `Voting`:
- The admin (owner) creates a list of candidates.
- Each user may only vote once for one candidate.
- Log each successful vote with an event.

### Requirements:
1️⃣ Struct `Candidate` containing `name (string)`, `voteCount (uint)`  
2️⃣ Mapping `candidates(uint => Candidate)`  
3️⃣ Mapping `hasVoted(address => bool)`  
4️⃣ Modifier `onlyOwner` to control candidate creation  
5️⃣ Event `Voted(address voter, uint candidateId)`

## 💻 How to Run
- Paste the code into Remix IDE: https://remix.ethereum.org
- Deploy → Add candidates → Cast votes → Check the event log and vote count results.
