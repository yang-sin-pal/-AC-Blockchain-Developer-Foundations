import { ethers } from "hardhat";
import { MyNFT } from "../typechain";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Interacting with the account:", deployer.address);

  const myNFT: MyNFT = await ethers.getContract("MyNFT");
  const recipient = deployer.address; // self-mint; deployer comes from getSigners() (a real Signer), so .address is valid

  const nextId = await myNFT.nextTokenId();
  const tx = await myNFT.mint(recipient); // WRITE: costs gas
  await tx.wait();                        // wait for confirmation

  console.log(`Minted tokenId ${nextId} to ${recipient}`);
  console.log("ownerOf:", await myNFT.ownerOf(nextId));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
