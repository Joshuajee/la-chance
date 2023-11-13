import {loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { deploy, testUSDCPrice, ticket } from "../scripts/helper";


describe("JackpotBase", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  

  const ticket1 = ticket(10, 12, 40, 50, 20)

  describe("Deployment", function () {
    
    it("Should set the right unlockTime", async function () {
      const { jackpotBase } = await loadFixture(deploy);

    });

  });


  describe("Buy Tickets", function () {

        
    it("Should Revert if provided token is not accepted", async function () {
      const { jackpotBase, user1 } = await loadFixture(deploy);

      await expect(jackpotBase.write.buyTickets([user1.account.address, ticket1])).to.be.rejectedWith("UnAcceptedERC20Token");

    });
    

    //ERC20InsufficientAllowance
    it("Should update required state when a ticket is bought", async function () {
      const { jackpotBase, TUSDC } = await loadFixture(deploy);

      await TUSDC.write.approve([jackpotBase.address, testUSDCPrice])

      await jackpotBase.write.buyTickets([TUSDC.address, ticket1]);

      expect(await jackpotBase.read.gameRounds()).to.be.equal(1n);
      expect(await jackpotBase.read.gameTickets()).to.be.equal(2n);

      expect(await jackpotBase.read.ticketFrequency1([1n, ticket1[0].value1])).to.be.equal(1n);
      expect(await jackpotBase.read.ticketFrequency2([1n, ticket1[0].value2])).to.be.equal(1n);
      expect(await jackpotBase.read.ticketFrequency3([1n, ticket1[0].value3])).to.be.equal(1n);
      expect(await jackpotBase.read.ticketFrequency4([1n, ticket1[0].value4])).to.be.equal(1n);
      expect(await jackpotBase.read.ticketFrequency5([1n, ticket1[0].value5])).to.be.equal(1n);

    });

  });

  
});
