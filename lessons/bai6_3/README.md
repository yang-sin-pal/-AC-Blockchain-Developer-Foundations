# Exercise 6.3 – Mint an NFT with Hardhat

🎯 Objective:

- Write, deploy, and mint an ERC721 NFT using Hardhat.

---

## ✅ Requirements

1. Write the `MyNFT` contract:

   - Inherit from ERC721
   - Include a `nextTokenId` variable
   - Add a `mint(address to)` function callable only by the owner
   - Increment `nextTokenId` with each mint
2. Write a deploy script:

   - Deploy the contract
   - Mint 1 NFT to the deployer
   - Print `ownerOf(0)`

---

## 💡 Hints

- Use `_safeMint(to, nextTokenId)` to mint the NFT
- The `ownerOf()` function returns the owner's address

---

## 🧪 Run the command

```bash
npx hardhat deploy --network sepolia --tags deploy
```

After deploying, run the `test.ts` file to mint one NFT and return its owner address.
