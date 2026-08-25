# 🧪 TypeScript Exercise – Smart Contract Simulation

In the lesson, you learned that smart contracts can store and update data.
Now you will replicate that behavior in TypeScript.

---

## 🎯 Requirements:
1. Create a `SmartContract` class with a `message` property of type `string`.
2. A constructor that initializes `message`.
3. An `updateMessage(newMsg: string)` function that updates the `message`.
4. A `getMessage()` function that returns the current message.

---

## 🧪 Example:

```ts
const contract = new SmartContract("Hello");
console.log(contract.getMessage()); // 👉 "Hello"

contract.updateMessage("Blockchain!");
console.log(contract.getMessage()); // 👉 "Blockchain!"
```

---

## 🧠 Hints:
- Similar to the HelloWorld smart contract in Solidity.
- You don't need file operations — just work within a class.

---

## 📝 Notes:
- This is an optional exercise, but highly recommended if you want to understand state and functions in a smart contract.
