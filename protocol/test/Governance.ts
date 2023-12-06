import {loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { deployGovernanceTest } from "../scripts/helper";
import { zeroAddress } from "viem";
import hre from "hardhat";

describe("Governance", function () {

  const proposalArg  = [
    [zeroAddress, zeroAddress],
    [1n, 2n],
    ["0x", "0x"],
    "First proposal"
  ]

  const amount = BigInt(10**20)

  async function deployAndSponsor() {

    const { Governance, GovernanceToken, user1, user2 } = await loadFixture(deployGovernanceTest);

    await Governance.write.propose(proposalArg)

    const amount = BigInt(10**20)

    await GovernanceToken.write.sponsorProposal([1n, amount]);

    const proposal = await Governance.read.proposalMapping([1n])

    return { Governance, GovernanceToken, user1, user2, proposal }
    
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

    });
    
  });

  describe("Voting ", function () {

    it("Should Revert if proposal is not active ", async function () {

      const { GovernanceToken } = await loadFixture(deployGovernanceTest);

      await expect(GovernanceToken.write.vote([1n, 1, amount])).to.be.rejectedWith("CanOnlyVoteOnActiveProposals(1, 0)");

    });
    
    it("Should record votes Abstained ", async function () {

      const { GovernanceToken, user1, proposal } = await loadFixture(deployAndSponsor);

      await GovernanceToken.write.vote([1n, 0, amount])

      const GovernorVault = await hre.viem.getContractAt("GovernorVault", proposal[1])

      expect(await GovernanceToken.read.balanceOf([proposal[1]])).to.be.equal(amount * 2n)

      expect(await GovernorVault.read.voteFunds()).to.be.equal(amount)

      expect(await GovernorVault.read.userVoteAbstained([user1.account.address])).to.be.equal(amount)

      expect(await GovernorVault.read.userVoteFor([user1.account.address])).to.be.equal(0n)

      expect(await GovernorVault.read.userVoteAgainst([user1.account.address])).to.be.equal(0n)

    });


    it("Should record votes For ", async function () {

      const { GovernanceToken, user1, proposal } = await loadFixture(deployAndSponsor);

      await GovernanceToken.write.vote([1n, 1, amount])

      const GovernorVault = await hre.viem.getContractAt("GovernorVault", proposal[1])

      expect(await GovernanceToken.read.balanceOf([proposal[1]])).to.be.equal(amount * 2n)

      expect(await GovernorVault.read.voteFunds()).to.be.equal(amount)

      expect(await GovernorVault.read.userVoteAbstained([user1.account.address])).to.be.equal(0n)

      expect(await GovernorVault.read.userVoteFor([user1.account.address])).to.be.equal(amount)

      expect(await GovernorVault.read.userVoteAgainst([user1.account.address])).to.be.equal(0n)

    });


    it("Should record votes Against ", async function () {

      const { GovernanceToken, user1, proposal } = await loadFixture(deployAndSponsor);

      await GovernanceToken.write.vote([1n, 2, amount])

      const GovernorVault = await hre.viem.getContractAt("GovernorVault", proposal[1])

      expect(await GovernanceToken.read.balanceOf([proposal[1]])).to.be.equal(amount * 2n)

      expect(await GovernorVault.read.voteFunds()).to.be.equal(amount)

      expect(await GovernorVault.read.userVoteAbstained([user1.account.address])).to.be.equal(0n)

      expect(await GovernorVault.read.userVoteFor([user1.account.address])).to.be.equal(0n)

      expect(await GovernorVault.read.userVoteAgainst([user1.account.address])).to.be.equal(amount)

    });

  });


  describe("Testing Execute ", function () {
    
    it("Should execute votes Abstained ", async function () {

      const { GovernanceToken, user1, proposal } = await loadFixture(deployAndSponsor);

      await GovernanceToken.write.vote([1n, 0, amount])

      const GovernorVault = await hre.viem.getContractAt("GovernorVault", proposal[1])

    });


    it("Should execute votes For ", async function () {

      const { GovernanceToken, user1, proposal } = await loadFixture(deployAndSponsor);

      await GovernanceToken.write.vote([1n, 1, amount])

      const GovernorVault = await hre.viem.getContractAt("GovernorVault", proposal[1])

    });


    it("Should execute votes Against ", async function () {

      const { GovernanceToken, user1, proposal } = await loadFixture(deployAndSponsor);

      await GovernanceToken.write.vote([1n, 2, amount])

      const GovernorVault = await hre.viem.getContractAt("GovernorVault", proposal[1])

    });

  });
  
});
