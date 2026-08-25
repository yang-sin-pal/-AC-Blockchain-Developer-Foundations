# Exercise 6.1 – Write a Basic ERC20 Token

🎯 Objective:
- Write and deploy a simple ERC20 Token using OpenZeppelin.

---

## ✅ Requirements

1. Write a contract named `MyToken`:
   - Token name: `MyToken`
   - Symbol: `MTK`
   - Total supply: 1,000,000 tokens
   - Mint the entire supply to the deployer in the constructor

2. Write a deploy script:
   - Deploy the contract
   - Print the contract address

---

## 💡 Hints

- Import OpenZeppelin ERC20:
```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```
- Use `_mint(msg.sender, amount)` to create the initial total supply

---

## 🧪 Run the deploy script

```bash
npx hardhat deploy --network sepolia --tags deploy
```

After deploying, run the `test.ts` file to check the deployer's balance.
