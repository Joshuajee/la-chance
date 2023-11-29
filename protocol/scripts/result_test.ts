import hre from "hardhat";


async function main() {

    const GAS_CALLBACK = 400000n

    const JackpotCore = await hre.viem.getContractAt("JackpotCore", "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e")

    console.log(await JackpotCore.read.results([0n]))

    const Chainlink = await hre.viem.getContractAt("Chainlink", "0x610178da211fef7d417bc0e6fed39f05609ad788")

    const VRFCoordinatorV2Mock = await hre.viem.getContractAt("VRFCoordinatorV2Mock", "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707")
  
    // Increase Time by 1hr 1 min
    await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

    await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

    console.log(await JackpotCore.read.gameRounds())

    await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, "0x610178da211fef7d417bc0e6fed39f05609ad788", [10n, 19n, 39n, 90n, 99n]
    ]);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
