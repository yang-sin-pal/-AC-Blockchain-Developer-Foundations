import { task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-verify";
import "hardhat-contract-sizer";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";

dotenv.config();

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) console.log(account.address);
});

const { TESTNET_PRIVATE_KEY, MAINNET_PRIVATE_KEY } = process.env;
const reportGas = process.env.REPORT_GAS;

module.exports = {
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      chainId: 11155111,
      accounts: [TESTNET_PRIVATE_KEY],
      timeout: 40000,
    },
    ethereum: {
      url: "https://eth-mainnet.publicnode.com",
      chainId: 1,
      accounts: [MAINNET_PRIVATE_KEY],
      timeout: 60000,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: { enabled: true, runs: 1000 },
          viaIR: true,
          evmVersion: "cancun", // Hardhat 2 silently defaults to "paris"; OZ 5.x utils (Bytes.sol via ERC721→Strings) use the Cancun-only mcopy opcode
        },
      },
    ],
  },
  abiExporter: {
    path: "data/abi",
    runOnCompile: true,
    clear: true,
    flat: false,
    only: [],
    spacing: 4,
  },
  gasReporter: {
    enabled: reportGas == "1",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
  },
  etherscan: {
    apiKey: {
      mainnet: "",
      sepolia: process.env.ETHERSCAN_API ?? "",
    },
  },
  sourcify: { enabled: true }, // was enabled: false
  mocha: {
    timeout: 40000,
  },
  namedAccounts: {
    deployer: 0,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
};