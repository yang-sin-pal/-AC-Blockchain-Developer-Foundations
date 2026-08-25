# Exercise 7.1 – Mint ERC20 Token

🎯 Objective:
- Write, deploy, and mint an ERC20 token using Hardhat.

---

## ✅ Requirements

1. Write the `MyMintableToken` contract:
   - Inherit from ERC20
   - The `mint(address to, uint amount)` function must be restricted to the owner only

2. Write a deploy script:
   - Deploy the contract
   - Mint 1000 tokens to the deployer
   - Print the deployer's balance

---

## 💡 Hints

- Inherit `Ownable` to use the `onlyOwner` modifier
- The `_mint()` function performs the token minting
- The `balanceOf()` function returns the balance

---

## 🧪 Run Command

```bash
npx hardhat deploy --network sepolia --tags deploy
```
