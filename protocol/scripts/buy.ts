import hre from "hardhat";
import { TEST_USDC, generateTickets, testUSDCPrice } from "./helper";

async function main() {

  //const [user1, user2] = await hre.viem.getWalletClients();

  const TestUSDC = await hre.viem.getContractAt("TestUSDC", TEST_USDC)

  const Jackpot = await hre.viem.getContractAt("Jackpot", "0x12d470884133d0b6846f60daae60affdfee2c1d1")

  await TestUSDC.write.approve([Jackpot.address, testUSDCPrice.toBigInt() * 200000n])

  await Jackpot.write.buyTickets([TestUSDC.address, generateTickets(10)]);



  console.log("DONE")


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
