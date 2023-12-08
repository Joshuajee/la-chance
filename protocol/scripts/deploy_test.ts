import hre from "hardhat"
import { deployTest } from "./helper";

async function main() {

  const {  Jackpot,
      JackpotCore,
      LendingProtocol,
      TUSDC,
      LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper,
      Chainlink,
  } = await deployTest()


  console.log("Jackpot ", Jackpot.address)

  console.log("Jackpot Core ", JackpotCore.address)

  console.log("Lending Protocol ", LendingProtocol.address)

  console.log("Test USDC ", TUSDC.address)

  console.log("LinkToken ", LinkToken.address)

  console.log("Chainlink ", Chainlink.address)

  console.log("VRFCoordinatorV2Mock ", VRFCoordinatorV2Mock.address)

  console.log("MockV3Aggregator ", MockV3Aggregator.address)

  console.log("VRFV2Wrapper ", VRFV2Wrapper.address)

  const BorrowerContract = await hre.viem.deployContract("FlashBorrowerExample")

  console.log("Borrower: ", BorrowerContract.address)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
