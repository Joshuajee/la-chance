import hre from "hardhat";
import { LENDING_PROTOCOL, TEST_USDC, flashloan } from "./helper";
import dotenv from 'dotenv'

dotenv.config()

async function main() {

  const TestUSDC = await hre.viem.getContractAt("TestUSDC", TEST_USDC)

  const LendingProtocol = await hre.viem.getContractAt("LendingProtocol", LENDING_PROTOCOL)

  for (let i = 0; i < 100; i++) {
    await flashloan(TestUSDC, LendingProtocol);
    console.log("Process ", i + 1, " / 100")
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
