import hre from "hardhat";
import { LENDING_PROTOCOL, TEST_USDC, flashloan } from "./helper";
import dotenv from 'dotenv'

dotenv.config()

async function main() {

  const TestUSDC = await hre.viem.getContractAt("TestUSDC", TEST_USDC)

  const LendingProtocol = await hre.viem.getContractAt("LendingProtocol", LENDING_PROTOCOL)


  const BorrowerContract = await hre.viem.deployContract("FlashBorrowerExample")

  console.log(BorrowerContract.address)

  await TestUSDC.write.transfer([BorrowerContract.address,  BigInt(10e20)])

  const protocolBalance = await TestUSDC.read.balanceOf([LendingProtocol.address])

  console.log(protocolBalance)

  // await LendingProtocol.write.flashLoan([TestUSDC.address, BorrowerContract.address, protocolBalance])

  console.log("DONE")

  //await flashloan(TestUSDC, LendingProtocol);
  
  // for (let i = 0; i < 100; i++) {
  //   await flashloan(TestUSDC, LendingProtocol);
  //   console.log("Process ", i + 1, " / 100")
  // }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
