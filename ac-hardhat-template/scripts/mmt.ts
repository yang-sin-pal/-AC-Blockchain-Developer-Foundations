import { ethers } from "hardhat";
import { MyMintableToken } from "../typechain";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Interacting with the account:", deployer.address);

  const token: MyMintableToken = await ethers.getContract("MyMintableToken");
  const amount = ethers.parseEther("100");

  const before = await token.balanceOf(deployer.address);
  const tx = await token.mint(deployer.address, amount); // WRITE: costs gas
  await tx.wait();                                       // wait for confirmation

  const after = await token.balanceOf(deployer.address);
  console.log(`Minted ${ethers.formatEther(amount)} MMT to ${deployer.address}`);
  console.log(`balanceOf: ${ethers.formatEther(before)} -> ${ethers.formatEther(after)} MMT`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
