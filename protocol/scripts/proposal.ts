import hre from "hardhat";

async function main() {

    const Governance = await hre.viem.getContractAt("Governance", "0x6237f14c122710860b8719fc971201167236e0e9")

    const proposalArg  = [
        [Governance.address],
        [15n],
        ["0x"],
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam placerat malesuada metus, ac dictum magna dapibus quis. Phasellus molestie ante pretium laoreet aliquam."
    ]
    

    for (let i = 0; i < 5; i++) {
        await Governance.write.propose(proposalArg)
        console.log("Process ", i + 1, " / 5")
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
