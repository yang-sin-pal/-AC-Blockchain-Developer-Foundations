import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain";

describe("MyToken", function () {
  let myToken: MyToken;
  const INITIAL_SUPPLY = 1_000_000n * 10n ** 18n; // 1M MTK, 18 decimals

  before(async () => {
    console.log("Deploying MyToken contract...");
    myToken = await (await ethers.getContractFactory("MyToken")).deploy();
    await myToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      expect(await myToken.name()).to.equal("MyToken");
    });

    it("Should set the right symbol", async function () {
      expect(await myToken.symbol()).to.equal("MTK");
    });

    it("Should default to 18 decimals", async function () {
      expect(await myToken.decimals()).to.equal(18n);
    });

    it("Should set total supply to 1M tokens", async function () {
      expect(await myToken.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("Should assign the entire supply to the deployer", async function () {
      const [deployer] = await ethers.getSigners();
      expect(await myToken.balanceOf(deployer.address)).to.equal(INITIAL_SUPPLY);
    });
  });
});