import hre from "hardhat";
import { flashloan } from "./helper";

async function main() {

  const TestUSDC = await hre.viem.getContractAt("TestUSDC", "0x5fbdb2315678afecb367f032d93f642f64180aa3")

  const LendingProtocol = await hre.viem.getContractAt("LendingProtocol", "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9")

  for (let i = 0; i < 1000; i++) {
    await flashloan(TestUSDC, LendingProtocol);
    console.log("Process ", i + 1, " / 1000")
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
