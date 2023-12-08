import hre from "hardhat";
import { mine } from "@nomicfoundation/hardhat-network-helpers";


// async function main() {

//     const JackpotCore = await hre.viem.getContractAt("JackpotCore", "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e")

//     const Chainlink = await hre.viem.getContractAt("Chainlink", "0x610178da211fef7d417bc0e6fed39f05609ad788")

//     const VRFCoordinatorV2Mock = await hre.viem.getContractAt("VRFCoordinatorV2Mock", "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707")
  
//     // Increase Time by 1hr 1 min
//     await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

//     await Chainlink.write.randomRequestRandomWords();

//     console.log(await JackpotCore.read.gameRounds())

//     await mine(3);

//     await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
//       await JackpotCore.read.gameRounds(), "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853", [10n, 19n, 39n, 90n, 99n]
//     ]);


//     console.log(await JackpotCore.read.results([1n]))
// }


async function main() {

  const JackpotCore = await hre.viem.getContractAt("JackpotCore", "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e")

  const Chainlink = await hre.viem.getContractAt("Chainlink", "0x610178da211fef7d417bc0e6fed39f05609ad788")

  // Increase Time by 1hr 1 min
  await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

  await Chainlink.write.fakeIt();

  console.log(await JackpotCore.read.gameRounds())

  await mine(3);

  console.log(await JackpotCore.read.results([1n]))
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
