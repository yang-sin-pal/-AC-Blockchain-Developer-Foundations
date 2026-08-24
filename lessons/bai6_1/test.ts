import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");

  const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)"
  ];
  const contractAddress = "0x82AAcD5Be037A483Fc3E0cC5f2B65747A18Ab595";
  const contract = new ethers.Contract(contractAddress, abi, provider);

  /**
   * Get the current balance of deployer
   */
   const [name, symbol, decimals] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals()
  ]);
  console.log(`${name} (${symbol}), decimals: ${decimals}`);

  const DEPLOYER_ADDRESS = "0x09104dDE09702C60772889E1134C54bf75c77e1b";
  const balance = await contract.balanceOf(DEPLOYER_ADDRESS);
  console.log("Current balance is:", ethers.formatUnits(balance, decimals));
}

main().catch(console.error);
