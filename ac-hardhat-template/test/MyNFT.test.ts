import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { MyNFT } from "../typechain";

describe("MyNFT", function () {
  let myNFT: MyNFT;

  before(async () => {
    myNFT = await (await ethers.getContractFactory("MyNFT")).deploy();
    await myNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      expect(await myNFT.name()).to.equal("MyNFT");
    });

    it("Should set the right symbol", async function () {
      expect(await myNFT.symbol()).to.equal("MNFT");
    });

    it("Should start nextTokenId at 0", async function () {
      expect(await myNFT.nextTokenId()).to.equal(0n);
    });
  });

  describe("Mint", function () {
    it("Should mint token #0 to the deployer and bump nextTokenId", async function () {
      const [deployer] = await ethers.getSigners();
      await (await myNFT.mint(deployer.address)).wait();

      expect(await myNFT.ownerOf(0n)).to.equal(deployer.address);
      expect(await myNFT.nextTokenId()).to.equal(1n);
    });

    it("Should assign sequential tokenIds on further mints", async function () {
      const [, other] = await ethers.getSigners();
      await (await myNFT.mint(other.address)).wait();

      expect(await myNFT.ownerOf(1n)).to.equal(other.address);
      expect(await myNFT.nextTokenId()).to.equal(2n);
    });

    it("Should reject minting from a non-owner", async function () {
      const [, other] = await ethers.getSigners();
      await expect(
        myNFT.connect(other).mint(other.address)
      ).to.be.revertedWithCustomError(myNFT, "OwnableUnauthorizedAccount");
    });
  });
});
