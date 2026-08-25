# Lesson 6.1 – Report

#### 1. Write the `MyToken.sol` contract — ERC20 inheriting from OpenZeppelin, name "MyToken", symbol "MTK", mint the full 1,000,000 tokens to the deployer in the constructor

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // 18 decimals default
    }
}
```

#### 2. Write the deploy script and deploy to Sepolia using hardhat-deploy

Run the command `npx hardhat deploy --network sepolia --tags deploy` — the script prints the network name, contract address, and transaction:

![Deploying MyToken contract to Sepolia](solution_images/1_deploy_MyToken_contract_sepolia.png)

- Contract address: [`0x82AAcD5Be037A483Fc3E0cC5f2B65747A18Ab595`](https://sepolia.etherscan.io/address/0x82AAcD5Be037A483Fc3E0cC5f2B65747A18Ab595)
- Source code verified on **Etherscan** (Standard JSON Input)

#### 3. Run `test.ts` to check the deployer's balance via RPC PublicNode

The test file reads `name` / `symbol` / `decimals` / `balanceOf(deployer)` through the ERC20 ABI using ethers v6, and is executed via `npm run lesson bai6_1`:

![Result of npm run lesson bai6_1](solution_images/2_npm_run_lesson_bai6_1.png)

- Result: `MyToken (MTK), decimals: 18`
- Deployer balance: `999800.0 MTK` = 1,000,000 initial minus 2 test transfer transactions of 100 MTK each
