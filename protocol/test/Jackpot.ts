import {loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { deployTest, testUSDCPrice, ticket } from "../scripts/helper";


describe("Jackpot", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  

  const ticket1 = ticket(10, 12, 40, 50, 20)

  // describe("deployTestment", function () {
    
  //   it("Should set the right unlockTime", async function () {
  //     const { Jackpot } = await loadFixture(deployTest);

  //   });

  // });


  describe("Buy Tickets", function () {

        
    // it("Should Revert if provided token is not accepted", async function () {
    //   const { Jackpot, TUSDC } = await loadFixture(deployTest);

    //   await TUSDC.write.approve([Jackpot.address, testUSDCPrice.toBigInt()])

    //   await expect(Jackpot.write.buyTickets([TUSDC.address, ticket1])).to.be.rejectedWith("UnAcceptedERC20Token");

    // });
    

    //ERC20InsufficientAllowance
    it("Should update required ticket data when a ticket is bought", async function () {
      const { Jackpot, TUSDC } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, testUSDCPrice.toBigInt()])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      expect(await Jackpot.read.gameRounds()).to.be.equal(1n);
      expect(await Jackpot.read.gameTickets()).to.be.equal(2n);

      // expect(await Jackpot.read.ticketFrequency1([1n, ticket1[0].value1])).to.be.equal(1n);
      // expect(await Jackpot.read.ticketFrequency2([1n, ticket1[0].value2])).to.be.equal(1n);
      // expect(await Jackpot.read.ticketFrequency3([1n, ticket1[0].value3])).to.be.equal(1n);
      // expect(await Jackpot.read.ticketFrequency4([1n, ticket1[0].value4])).to.be.equal(1n);
      // expect(await Jackpot.read.ticketFrequency5([1n, ticket1[0].value5])).to.be.equal(1n);

    });


    it("All ticket funds should go to the lending protocol", async function () {

      const { Jackpot, TUSDC, LendingProtocol } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, BigInt(testUSDCPrice.toString())])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);
      
      expect(await TUSDC.read.balanceOf([LendingProtocol.address])).to.be.equal(testUSDCPrice.toBigInt())

    });

    it("Should update required vault data when a ticket is bought", async function () {

      const { Jackpot, TUSDC } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, BigInt(testUSDCPrice.toString())])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      const vaultAddresses = await Jackpot.read.vaultAddresses()

      const vaultShare = await Jackpot.read.vaultShare()

      const vault1 = await hre.viem.getContractAt("Vault", vaultAddresses[0])
      const vault2 = await hre.viem.getContractAt("Vault", vaultAddresses[1])
      const vault3 = await hre.viem.getContractAt("Vault", vaultAddresses[2])
      const vault4 = await hre.viem.getContractAt("Vault", vaultAddresses[3])
      const vault5 = await hre.viem.getContractAt("Vault", vaultAddresses[4])
      const daoVault = await hre.viem.getContractAt("Vault", vaultAddresses[5])

      expect(await vault1.read.tokenBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[0])).div(100).toString())
      )

      expect(await vault2.read.tokenBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[1])).div(100).toString())
      )

      expect(await vault3.read.tokenBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[2])).div(100).toString())
      )

      expect(await vault4.read.tokenBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[3])).div(100).toString())
      )

      expect(await vault5.read.tokenBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[4])).div(100).toString())
      )

      expect(await daoVault.read.tokenBalance([TUSDC.address])).to.be.equal(
        BigInt((testUSDCPrice.mul(vaultShare[5])).div(100).toString())
      )

    });


    it("Should update required ticket data when a ticket is bought", async function () {

      const Ticket = ticket1[0] 

      const { Jackpot, TUSDC } = await loadFixture(deployTest);

      const gameRounds = await Jackpot.read.gameRounds()

      await TUSDC.write.approve([Jackpot.address, testUSDCPrice.toBigInt()])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      expect(await Jackpot.read.ticketFrequency1_1([gameRounds, Ticket.value1])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency1_2([gameRounds, Ticket.value2])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency1_3([gameRounds, Ticket.value3])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency1_4([gameRounds, Ticket.value4])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency1_5([gameRounds, Ticket.value5])).to.be.equal(1n)

      // Test 2 values
      expect(await Jackpot.read.ticketFrequency2_1([gameRounds, Ticket.value1, Ticket.value2])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency2_2([gameRounds, Ticket.value1, Ticket.value3])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency2_3([gameRounds, Ticket.value1, Ticket.value4])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency2_4([gameRounds, Ticket.value1, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency2_5([gameRounds, Ticket.value2, Ticket.value3])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency2_6([gameRounds, Ticket.value2, Ticket.value4])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency2_7([gameRounds, Ticket.value2, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency2_8([gameRounds, Ticket.value3, Ticket.value4])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency2_9([gameRounds, Ticket.value3, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency2_10([gameRounds, Ticket.value4, Ticket.value5])).to.be.equal(1n)

      // Test 3 values
      expect(await Jackpot.read.ticketFrequency3_1([gameRounds, Ticket.value1, Ticket.value2, Ticket.value3])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency3_2([gameRounds, Ticket.value1, Ticket.value2, Ticket.value4])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency3_3([gameRounds, Ticket.value1, Ticket.value2, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency3_4([gameRounds, Ticket.value1, Ticket.value3, Ticket.value4])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency3_5([gameRounds, Ticket.value1, Ticket.value3, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency3_6([gameRounds, Ticket.value1, Ticket.value4, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency3_7([gameRounds, Ticket.value2, Ticket.value3, Ticket.value4])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency3_8([gameRounds, Ticket.value2, Ticket.value3, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency3_9([gameRounds, Ticket.value2, Ticket.value4, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency3_10([gameRounds, Ticket.value3, Ticket.value4, Ticket.value5])).to.be.equal(1n)


      // Test 4 values
      expect(await Jackpot.read.ticketFrequency4_1([gameRounds, Ticket.value1, Ticket.value2, Ticket.value3, Ticket.value4])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency4_2([gameRounds, Ticket.value1, Ticket.value2, Ticket.value3, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency4_3([gameRounds, Ticket.value1, Ticket.value2, Ticket.value4, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency4_4([gameRounds, Ticket.value1, Ticket.value3, Ticket.value4, Ticket.value5])).to.be.equal(1n)
      expect(await Jackpot.read.ticketFrequency4_5([gameRounds, Ticket.value2, Ticket.value3, Ticket.value4, Ticket.value5])).to.be.equal(1n)
          
      // Test 5 values
      expect(await Jackpot.read.ticketFrequency5([gameRounds, Ticket.value1, Ticket.value2, Ticket.value3, Ticket.value4, Ticket.value5])).to.be.equal(1n)

    });

  });






  describe("Handle Results", function () {

    it("Should make random request and state should be updated accordily", async function () {

      const { Jackpot, TUSDC } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      await Jackpot.write.randomRequestRandomWords([300_000]);

      const request = (await Jackpot.read.s_requests([1n]))

      expect(request[1]).to.be.equal(false)

      expect(await Jackpot.read.results([1n])).to.be.deep.equal([0n, 0n, 0n, 0n, 0n])

      // gameRounds should be 2 and gameTickets should be 1
      expect(await Jackpot.read.gameRounds()).to.be.equal(1n)

      expect(await Jackpot.read.gameTickets()).to.be.equal(2n)

      expect(await Jackpot.read.getNumberOfRandomRequests()).to.be.equal(1n)
      
    });


    it("Should make random request and receive random number, state should be updated", async function () {

      const { Jackpot, TUSDC, VRFCoordinatorV2Mock, VRFV2Wrapper } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      await Jackpot.write.randomRequestRandomWords([300_000]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWords([1n, VRFV2Wrapper.address])

      const request = (await Jackpot.read.s_requests([1n]))

      expect(request[1]).to.be.equal(true)

      expect(await Jackpot.read.results([1n])).to.not.deep.equal([[0n], [0n],[0n],[0n],[0n]])

      expect(await Jackpot.read.gameRounds()).to.be.equal(2n)

      expect(await Jackpot.read.gameTickets()).to.be.equal(1n)
      
    });

    

  });

  
});
