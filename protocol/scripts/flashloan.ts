import hre from "hardhat";
import dotenv from 'dotenv'

dotenv.config()

async function main() {

  const TestUSDC = await hre.viem.getContractAt("TestUSDC", "0xeb52d74c78e50e1b1d30f93b57ae7e66376b8bf6")

  const LendingProtocol = await hre.viem.getContractAt("LendingProtocol", "0xebb1d7a9d9807d4a61a6cfab1dc9884fec76defa")

  const BorrowerContract = await hre.viem.deployContract("FlashBorrowerExample")

  console.log(BorrowerContract.address)

  await TestUSDC.write.transfer([BorrowerContract.address,  4900000000000000000n])

  const protocolBalance = await TestUSDC.read.balanceOf([LendingProtocol.address])

  console.log(protocolBalance)

  await LendingProtocol.write.flashLoan(["0xeb52d74c78e50e1b1d30f93b57ae7e66376b8bf6", BorrowerContract.address, protocolBalance])

  console.log("DONE")

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
