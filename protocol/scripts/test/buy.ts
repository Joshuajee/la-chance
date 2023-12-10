import hre from "hardhat";
import { generateTickets, testUSDCPrice } from "../helper";

async function main() {

  //const [user1, user2] = await hre.viem.getWalletClients();

  const TestUSDC = await hre.viem.getContractAt("TestUSDC", "0x0165878a594ca255338adfa4d48449f69242eb8f")

  const Jackpot = await hre.viem.getContractAt("Jackpot", "0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863ae")

  await TestUSDC.write.approve([Jackpot.address, testUSDCPrice.toBigInt() * 200000n])

  for (let i = 0; i < 3; i++) {
    await Jackpot.write.buyTickets([TestUSDC.address, generateTickets(20)]);
    console.log("Process ", i + 1, " / 10")
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
