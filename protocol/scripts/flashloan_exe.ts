import hre from "hardhat";
import { LENDING_PROTOCOL, TEST_USDC } from "./helper";


async function main() {

  const TestUSDC = await hre.viem.getContractAt("TestUSDC", TEST_USDC)

  const LendingProtocol = await hre.viem.getContractAt("LendingProtocol", LENDING_PROTOCOL)

  const Borrower = await hre.viem.getContractAt("BorrowerExample", "0xfa1ed18f424b0fbc9f1fe0826939abd78db850d6")

  const balance = await TestUSDC.read.balanceOf([LendingProtocol.address])

  await TestUSDC.write.approve([Borrower.address, balance])

  await Borrower.write.borrow([LendingProtocol.address, TestUSDC.address, balance ])
 
  console.log("Borrower: ", Borrower.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
