# Exercise 5.3 – Interacting with a Smart Contract via ABI

🎯 Objectives:
- Understand and use ABI to call smart contract functions.
- Connect to an already-deployed contract and call a read function.

---

## ✅ Requirements

Assume there is a `Counter` contract deployed at the following address:
```
Contract Address: 0x1234567890abcdef1234567890abcdef12345678
```

And the following ABI:
```ts
[
  "function getCount() public view returns (uint)",
  "function increment() public"
]
```

Write a script using ethers.js to:
1. Connect to the contract (using the address and ABI above)
2. Call `getCount()` and print the result

---

## 💡 Hints

- Use `new ethers.Contract(address, abi, providerOrSigner)`
- For read-only calls (view functions), only a `provider` is needed
- Call: `await contract.getCount()`

---

## 🧪 Run the command

```bash
npx ts-node test.ts
```

✅ If the current count is displayed, you have correctly understood how a frontend uses an ABI to interact with a contract!
