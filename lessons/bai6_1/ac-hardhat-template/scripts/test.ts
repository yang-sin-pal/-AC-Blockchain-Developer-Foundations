import { ethers } from "hardhat";
import { MyToken } from "../typechain";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Interacting with the account:", deployer.address);

  const myToken: MyToken = await ethers.getContract("MyToken");

  const recipient = ethers.Wallet.createRandom().address;
  console.log("Recipien address: ", recipient);

  const amount = 100n * 10n ** 18n; // 100 MTK

  console.log(
    "Recipient balance before:",
    ethers.formatUnits(await myToken.balanceOf(recipient), 18)
  );

  const tx = await myToken.transfer(recipient, amount); // WRITE: costs gas
  await tx.wait();                                      // wait for confirmation

  console.log(
    "Recipient balance after: ",
    ethers.formatUnits(await myToken.balanceOf(recipient), 18)
  );
  console.log(
    "Deployer balance after:  ",
    ethers.formatUnits(await myToken.balanceOf(deployer.address), 18)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});