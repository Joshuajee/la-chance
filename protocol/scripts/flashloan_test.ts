import hre from "hardhat";
import { flashloan } from "./helper";

async function main() {

  const TestUSDC = await hre.viem.getContractAt("TestUSDC", "0x0165878a594ca255338adfa4d48449f69242eb8f")

  const LendingProtocol = await hre.viem.getContractAt("LendingProtocol", "0x8a791620dd6260079bf849dc5567adc3f2fdc318")


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
