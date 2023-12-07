import hre from "hardhat";
import { generateTickets, testUSDCPrice } from "./helper";

async function main() {

  //const [user1, user2] = await hre.viem.getWalletClients();

  const TestUSDC = await hre.viem.getContractAt("TestUSDC", "0x5fbdb2315678afecb367f032d93f642f64180aa3")

  const Jackpot = await hre.viem.getContractAt("Jackpot", "0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0")

  await TestUSDC.write.approve([Jackpot.address, testUSDCPrice.toBigInt() * 200000n])

  for (let i = 0; i < 1; i++) {
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
