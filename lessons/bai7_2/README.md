# Exercise 7.2 – Verify MyMintableToken on Etherscan

🎯 Objective:
- Deploy the `MyMintableToken` ERC20 contract on Sepolia
- Verify the contract on Etherscan

---

## ✅ Step 1 – Install the verify plugin

```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

---

## ✅ Step 2 – Add configuration to `hardhat.config.ts`

```ts
import "@nomicfoundation/hardhat-verify";

module.exports = {
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  },
  etherscan: {
    apiKey: "YOUR_ETHERSCAN_API_KEY"
  }
}
```

⚠️ **Do not commit your private key**

---

## ✅ Step 3 – Deploy the contract

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

Save the contract address.

---

## ✅ Step 4 – Verify the contract

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

---

## ✅ Step 5 – Check on Etherscan

- The source code will be displayed publicly.
- Check the Read/Write Contract tabs.

---

## 🎯 Submission Requirements

- Contract address
- Etherscan verification link
- Screenshot of successful verification

---
