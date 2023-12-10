import hre from "hardhat";
import { deploy } from "./helper";

async function main() {
  
  const linkToken = {address: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"};
  const vrfV2Wrapper = {address: "0x9345AC54dA4D0B5Cda8CB749d8ef37e5F02BBb21" };


  const {Jackpot, JackpotCore, LendingProtocol, TUSDC, Chainlink, Governance, GovernanceToken, GovernorVault } = await deploy(linkToken, vrfV2Wrapper)


  console.log("\n\n\n\n\n\n\n\n")

  console.log("----------------------Addresses------------------")

  console.log("Jackpot ", Jackpot.address)

  console.log("Jackpot Core ", JackpotCore.address)

  console.log("Lending Protocol ", LendingProtocol.address)

  console.log("Test USDC ", TUSDC.address)

  console.log("Chainlink ", Chainlink.address)

  console.log("Governance ", Governance.address)

  console.log("Governance Token ", GovernanceToken.address)

  console.log("Governance Vault ", GovernorVault.address)

  const BorrowerContract = await hre.viem.deployContract("BorrowerExample")

  console.log("Borrower: ", BorrowerContract.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
