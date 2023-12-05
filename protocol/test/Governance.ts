import {loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { deployGovernanceTest } from "../scripts/helper";
import { zeroAddress } from "viem";

describe("Governance", function () {

  const proposalArg  = [
    [zeroAddress, zeroAddress],
    [1n, 2n],
    ["0x", "0x"],
    "First proposal"
  ]

  async function deployAndSponsor() {

    const { Governance, GovernanceToken } = await loadFixture(deployGovernanceTest);

    await Governance.write.propose(proposalArg)

    const proposal = await Governance.read.proposalMapping([1n])

    const amount = BigInt(10**20)

    await GovernanceToken.write.sponsorProposal([1n, amount]);

    return { Governance, GovernanceToken }
    
  }

  describe("Creating Proposal and sponsoring", function () {
    
    it("Should create pending proposal", async function () {

      const { Governance } = await loadFixture(deployGovernanceTest);

      await Governance.write.propose(proposalArg)

      expect(await Governance.read.proposalCounter()).to.be.equal(1n)

    });

    it("Should fund pending proposal and change status to active when sponsored with enough funds", async function () {

      const { Governance, GovernanceToken } = await loadFixture(deployGovernanceTest);

      await Governance.write.propose(proposalArg)

      const proposal = await Governance.read.proposalMapping([1n])

      const amount = BigInt(10**20)

      await GovernanceToken.write.sponsorProposal([1n, amount]);

      expect(await Governance.read.proposalCounter()).to.be.equal(1n)

      expect(await GovernanceToken.read.balanceOf([proposal[1]])).to.be.equal(amount)

      expect((await Governance.read.proposalMapping([1n]))[2]).to.be.equal(1)

    });


    it("Should fund pending proposal and status should remain pending when sponsored with not enough funds", async function () {

      const { Governance, GovernanceToken } = await loadFixture(deployGovernanceTest);

      await Governance.write.propose(proposalArg)

      const proposal = await Governance.read.proposalMapping([1n])

      const amount = BigInt(10**2)

      await GovernanceToken.write.sponsorProposal([1n, amount]);

      expect(await Governance.read.proposalCounter()).to.be.equal(1n)

      expect(await GovernanceToken.read.balanceOf([proposal[1]])).to.be.equal(amount)

      expect((await Governance.read.proposalMapping([1n]))[2]).to.be.equal(0)

      console.log(proposal)

    });
    
  });

  describe("Voting ", function () {
    
    it("Should create pending proposal", async function () {

      const { Governance } = await loadFixture(deployGovernanceTest);



    });

    it("Should fund pending proposal and change status to active when sponsored with enough funds", async function () {

      const { Governance, GovernanceToken } = await loadFixture(deployAndSponsor);

      
    });

    
  });
  
});
