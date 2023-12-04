import {loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { deployGovernanceTest } from "../scripts/helper";
import { ethers } from "ethers";

describe("Governance", function () {


  describe("Voting and Proposal", function () {
    
        it("Should transfer token on voting", async function () {

            const { Governance, GovernanceToken } = await loadFixture(deployGovernanceTest);

            await GovernanceToken.write.vote([1n, 0n, 1000000n])

            console.log(await GovernanceToken.read.balanceOf([Governance.address]))

            

            

        });
    
  });

  
});
