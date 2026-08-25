import { ethers } from "ethers";

async function main() {
  if (!process.env.TESTNET_PRIVATE_KEY) {
    throw new Error("Set $env:TESTNET_PRIVATE_KEY first (funded Sepolia key)");
  }
  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
  const wallet = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, provider);

  const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function nextTokenId() view returns (uint256)",
    "function mint(address to)",
    "function ownerOf(uint256 tokenId) view returns (address)"
  ];
  const contractAddress = "0xDfee82bf1967A3110B7430B749a82ab2cFe9A960";
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  /**
   * Mint an NFT to the deployer and print its owner
   */
  const [name, symbol] = await Promise.all([contract.name(), contract.symbol()]);
  console.log(`${name} (${symbol})`);

  const nextId = await contract.nextTokenId();
  const tx = await contract.mint(wallet.address); // WRITE: signed by wallet
  await tx.wait();                                // wait for confirmation

  console.log(`Minted tokenId ${nextId}`);
  console.log("Owner:", await contract.ownerOf(nextId));
}

main().catch(console.error);
