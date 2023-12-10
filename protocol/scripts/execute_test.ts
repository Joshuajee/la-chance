import hre from "hardhat";
import { ethers } from "ethers";
import { time } from '@nomicfoundation/hardhat-network-helpers';
import { flashloan, generateTickets, testUSDCPrice } from "./helper";


async function main() {

    const TestUSDC = await hre.viem.getContractAt("TestUSDC", "0x0165878a594ca255338adfa4d48449f69242eb8f")

    const Jackpot = await hre.viem.getContractAt("Jackpot", "0x9a9f2ccfde556a7e9ff0848998aa4a0cfd8863ae")
  
    await TestUSDC.write.approve([Jackpot.address, testUSDCPrice.toBigInt() * 200000n])
  

    await Jackpot.write.buyTickets([TestUSDC.address, generateTickets(20)]);


    const LendingProtocol = await hre.viem.getContractAt("LendingProtocol", "0x8a791620dd6260079bf849dc5567adc3f2fdc318")
  
  
    for (let i = 0; i < 10; i++) {
      await flashloan(TestUSDC, LendingProtocol);
      console.log("Process ", i + 1, " / 1000")
    }
  


    const Governance = await hre.viem.getContractAt("Governance", "0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0")

    const GovernanceToken = await hre.viem.getContractAt("GovernanceToken", "0x0dcd1bf9a1b36ce34237eeafef220932846bcd82")

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

    const id = 2n

    const amount = ethers.utils.parseUnits("100","ether")

    await GovernanceToken.write.supportProposal([id, amount.toBigInt()])

    await GovernanceToken.write.vote([id, 1, amount.toBigInt()])

    await time.increase(10000)

    await Governance.write.execute([id])
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
