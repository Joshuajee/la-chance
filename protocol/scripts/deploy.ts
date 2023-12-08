import hre from "hardhat";
import { testUSDCPrice } from "./helper";

async function main() {
  const linkToken = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  const vrfV2Wrapper = "0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693";
  //const VRFCoordinatorV2 = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";


  const TUSDC = await hre.viem.deployContract("TestUSDC");

  const Vault = await hre.viem.deployContract("Vault");

  const Pot = await hre.viem.deployContract("Pot");


  const LendingProtocol = await hre.viem.deployContract("LendingProtocol");

  const Chainlink = await hre.viem.deployContract("Chainlink", [linkToken, vrfV2Wrapper])

  const JackpotCore = await hre.viem.deployContract("JackpotCore");

  const Jackpot = await hre.viem.deployContract("Jackpot", [JackpotCore.address, LendingProtocol.address, Vault.address, Pot.address, TUSDC.address, testUSDCPrice.toBigInt()]);

  await Chainlink.write.initFactory([Jackpot.address])

  await JackpotCore.write.initFactory([Jackpot.address])

  await LendingProtocol.write.initFactory([Jackpot.address])

  //const Vaults = await Jackpot.read.vaultAddresses()

  console.log("Jackpot ", Jackpot.address)

  console.log("Jackpot Core ", JackpotCore.address)

  console.log("Lending Protocol ", LendingProtocol.address)

  console.log("Test USDC ", TUSDC.address)

  console.log("Chainlink ", Chainlink.address)

  const BorrowerContract = await hre.viem.deployContract("FlashBorrowerExample")

  console.log("Borrower: ", BorrowerContract.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
