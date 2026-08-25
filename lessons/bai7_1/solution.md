# Exercise 7.1 – Report

#### 1. Write the `MyMintableToken.sol` contract — ERC20 inheriting OpenZeppelin v5, named "MyMintableToken", symbol "MMT", with a `mint(address to, uint256 amount)` function restricted to the owner only, using `_mint`, and no initial token supply in the constructor

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyMintableToken is ERC20, Ownable {
    constructor() ERC20("MyMintableToken", "MMT") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
```

#### 2. Write the deploy script (`deploy/04-mymintabletoken.ts`, tag `mmt`) and deploy to Sepolia

The script follows the spec: deploy contract → mint 1000 MMT to the deployer → print the deployer's balance (in both MMT and wei formats). Run `npx hardhat deploy --network sepolia --tags mmt`:

![Deploy MyMintableToken to Sepolia](solution_images/1_deploy.png)

- Contract address: [`0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82`](https://sepolia.etherscan.io/address/0x43F7E84A4785Ae62c4B27dD591725b0C4BfA1B82)
- Fully fresh deployment — successfully minted 1000.0 MMT to the deployer and printed `balanceOf`

#### 3. Run the interaction script `scripts/mmt.ts` using the owner account

The script mints an additional 100 MMT to the deployer and prints the balance before and after. Run `npx hardhat run scripts/mmt.ts --network sepolia` with the regular key:

![Run script with owner](solution_images/2_run_script_owner.png)

- Result: `balanceOf: 1000.0 -> 1100.0 MMT` — mint succeeded because `msg.sender` is the owner

#### 4. Run the script again with a non-owner account

Use a different account in MetaMask, fund it with Sepolia ETH from a faucet, then run the script in a PowerShell window with a session-scoped environment variable (overriding `.env` without editing any file):

```powershell
$env:TESTNET_PRIVATE_KEY = "<Account2 private key>"
npx hardhat run scripts/mmt.ts --network sepolia
```

![Run script with non-owner](solution_images/3_run_script_NonOwner.png)

- The transaction reverts with custom error `OwnableUnauthorizedAccount(<burner address>)` — directly demonstrating on testnet that the `onlyOwner` modifier works correctly

---

Note: the contract has not been verified on Etherscan — manual verification (Standard JSON Input from `solcInputs/999f835e6a53cc806b1cec02f4c86694.json`) along with calling the `mint` function directly on Etherscan with both owner and non-owner will be performed in **Exercise 7.2**.
