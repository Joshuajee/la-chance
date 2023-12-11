import hre from "hardhat";


async function main() {

  const TestUSDC = await hre.viem.getContractAt("TestUSDC", "0x0165878a594ca255338adfa4d48449f69242eb8f")

  const LendingProtocol = await hre.viem.getContractAt("LendingProtocol", "0x8a791620dd6260079bf849dc5567adc3f2fdc318")

  const Borrower = await hre.viem.getContractAt("BorrowerExample", "0x68b1d87f95878fe05b998f19b66f4baba5de1aed")

  const balance = await TestUSDC.read.balanceOf([LendingProtocol.address])

  await TestUSDC.write.approve([Borrower.address, balance])

  await Borrower.write.borrow([LendingProtocol.address, TestUSDC.address, balance ])
 

  console.log("Borrower: ", Borrower.address)

  console.log(TestUSDC.address, LendingProtocol.address, Borrower.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
