import hre from "hardhat";
import { deploy } from "./helper";

async function main() {
  const linkToken = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  const vrfV2Wrapper = "0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693";
  //const VRFCoordinatorV2 = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";


  const {Jackpot, JackpotCore, LendingProtocol, TUSDC, Chainlink, Governance, GovernanceToken, GovernorVault } = await deploy(linkToken, vrfV2Wrapper)

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
