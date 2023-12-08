import hre from "hardhat";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { CHAINLINK } from "./helper";


async function main() {

    const Chainlink = await hre.viem.getContractAt("Chainlink", CHAINLINK)

    await Chainlink.write.randomRequestRandomWords();

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
