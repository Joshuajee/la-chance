import {loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { deploy, testUSDCPrice, ticket } from "../scripts/helper";


describe("JackpotBase", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  

  const ticket1 = ticket(10, 12, 40, 50, 20)

  // describe("Deployment", function () {
    
  //   it("Should set the right unlockTime", async function () {
  //     const { JackpotBase } = await loadFixture(deploy);

  //   });

  // });


  describe("Buy Tickets", function () {

        
    // it("Should Revert if provided token is not accepted", async function () {
    //   const { JackpotBase, TUSDC } = await loadFixture(deploy);

    //   await TUSDC.write.approve([JackpotBase.address, testUSDCPrice.toBigInt()])

    //   await expect(JackpotBase.write.buyTickets([TUSDC.address, ticket1])).to.be.rejectedWith("UnAcceptedERC20Token");

    // });
    

    //ERC20InsufficientAllowance
    it("Should update required ticket data when a ticket is bought", async function () {
      const { JackpotBase, TUSDC } = await loadFixture(deploy);

      await TUSDC.write.approve([JackpotBase.address, testUSDCPrice.toBigInt()])

      await JackpotBase.write.buyTickets([TUSDC.address, ticket1]);

      expect(await JackpotBase.read.gameRounds()).to.be.equal(1n);
      expect(await JackpotBase.read.gameTickets()).to.be.equal(2n);

      expect(await JackpotBase.read.ticketFrequency1([1n, ticket1[0].value1])).to.be.equal(1n);
      expect(await JackpotBase.read.ticketFrequency2([1n, ticket1[0].value2])).to.be.equal(1n);
      expect(await JackpotBase.read.ticketFrequency3([1n, ticket1[0].value3])).to.be.equal(1n);
      expect(await JackpotBase.read.ticketFrequency4([1n, ticket1[0].value4])).to.be.equal(1n);
      expect(await JackpotBase.read.ticketFrequency5([1n, ticket1[0].value5])).to.be.equal(1n);

    });


    it("All ticket funds should go to the lending protocol", async function () {

      const { JackpotBase, TUSDC, LendingProtocol } = await loadFixture(deploy);

      await TUSDC.write.approve([JackpotBase.address, BigInt(testUSDCPrice.toString())])

      await JackpotBase.write.buyTickets([TUSDC.address, ticket1]);
      
      expect(await TUSDC.read.balanceOf([LendingProtocol.address])).to.be.equal(testUSDCPrice.toBigInt())

    });

    it("Should update required vault data when a ticket is bought", async function () {

      const { JackpotBase, TUSDC } = await loadFixture(deploy);

      await TUSDC.write.approve([JackpotBase.address, BigInt(testUSDCPrice.toString())])

      await JackpotBase.write.buyTickets([TUSDC.address, ticket1]);

      const vaultAddresses = await JackpotBase.read.vaultAddresses()

      const vaultShare = await JackpotBase.read.vaultShare()

      const vault1 = await hre.viem.getContractAt("Vault", vaultAddresses[0])
      const vault2 = await hre.viem.getContractAt("Vault", vaultAddresses[1])
      const vault3 = await hre.viem.getContractAt("Vault", vaultAddresses[2])
      const vault4 = await hre.viem.getContractAt("Vault", vaultAddresses[3])
      const vault5 = await hre.viem.getContractAt("Vault", vaultAddresses[4])
      const daoVault = await hre.viem.getContractAt("Vault", vaultAddresses[5])

      expect(await vault1.read.assetBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[0])).div(100).toString())
      )

      expect(await vault2.read.assetBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[1])).div(100).toString())
      )

      expect(await vault3.read.assetBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[2])).div(100).toString())
      )

      expect(await vault4.read.assetBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[3])).div(100).toString())
      )

      expect(await vault5.read.assetBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[4])).div(100).toString())
      )

      expect(await daoVault.read.assetBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[5])).div(100).toString())
      )

    });

  });

  
});
