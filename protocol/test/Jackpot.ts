import {loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { deployTest, flashloan, testUSDCPrice, ticket } from "../scripts/helper";


const GAS_CALLBACK = 2000000n

describe("Jackpot", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.


  const ticket1 = [ticket(10, 12, 40, 50, 20)]

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
      const { Jackpot, JackpotCore, TUSDC } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, testUSDCPrice.toBigInt()])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      expect(await JackpotCore.read.gameRounds()).to.be.equal(1n);
      expect(await JackpotCore.read.gameTickets()).to.be.equal(1n);

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

      const { Jackpot, JackpotCore, TUSDC } = await loadFixture(deployTest);

      const gameRounds = await JackpotCore.read.gameRounds()

      await TUSDC.write.approve([Jackpot.address, testUSDCPrice.toBigInt()])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      expect(await JackpotCore.read.ticketFrequency1_1([gameRounds, Ticket.value1])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency1_2([gameRounds, Ticket.value2])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency1_3([gameRounds, Ticket.value3])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency1_4([gameRounds, Ticket.value4])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency1_5([gameRounds, Ticket.value5])).to.be.equal(1n)

      // Test 2 values
      expect(await JackpotCore.read.ticketFrequency2_1([gameRounds, Ticket.value1, Ticket.value2])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency2_2([gameRounds, Ticket.value1, Ticket.value3])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency2_3([gameRounds, Ticket.value1, Ticket.value4])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency2_4([gameRounds, Ticket.value1, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency2_5([gameRounds, Ticket.value2, Ticket.value3])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency2_6([gameRounds, Ticket.value2, Ticket.value4])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency2_7([gameRounds, Ticket.value2, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency2_8([gameRounds, Ticket.value3, Ticket.value4])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency2_9([gameRounds, Ticket.value3, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency2_10([gameRounds, Ticket.value4, Ticket.value5])).to.be.equal(1n)

      // Test 3 values
      expect(await JackpotCore.read.ticketFrequency3_1([gameRounds, Ticket.value1, Ticket.value2, Ticket.value3])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency3_2([gameRounds, Ticket.value1, Ticket.value2, Ticket.value4])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency3_3([gameRounds, Ticket.value1, Ticket.value2, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency3_4([gameRounds, Ticket.value1, Ticket.value3, Ticket.value4])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency3_5([gameRounds, Ticket.value1, Ticket.value3, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency3_6([gameRounds, Ticket.value1, Ticket.value4, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency3_7([gameRounds, Ticket.value2, Ticket.value3, Ticket.value4])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency3_8([gameRounds, Ticket.value2, Ticket.value3, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency3_9([gameRounds, Ticket.value2, Ticket.value4, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency3_10([gameRounds, Ticket.value3, Ticket.value4, Ticket.value5])).to.be.equal(1n)


      // Test 4 values
      expect(await JackpotCore.read.ticketFrequency4_1([gameRounds, Ticket.value1, Ticket.value2, Ticket.value3, Ticket.value4])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency4_2([gameRounds, Ticket.value1, Ticket.value2, Ticket.value3, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency4_3([gameRounds, Ticket.value1, Ticket.value2, Ticket.value4, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency4_4([gameRounds, Ticket.value1, Ticket.value3, Ticket.value4, Ticket.value5])).to.be.equal(1n)
      expect(await JackpotCore.read.ticketFrequency4_5([gameRounds, Ticket.value2, Ticket.value3, Ticket.value4, Ticket.value5])).to.be.equal(1n)

      // Test 5 values
      expect(await JackpotCore.read.ticketFrequency5([gameRounds, Ticket.value1, Ticket.value2, Ticket.value3, Ticket.value4, Ticket.value5])).to.be.equal(1n)

    });


    it("Should emit BuyTicket event", async function () {

      const { Jackpot, TUSDC } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, BigInt(testUSDCPrice.toString())])

      //expect(Jackpot.write.buyTickets([TUSDC.address, ticket1])).


    });

  });






  describe("Handle Results", function () {

    it("Should revert if Game Period has not elasped", async function () {

      const { Jackpot, Chainlink, TUSDC } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      await expect(Chainlink.write.randomRequestRandomWords([GAS_CALLBACK])).to.be.rejectedWith("StakingPeriodIsNotOver()");

    });


    it("Should make random request and state should be updated accordily", async function () {

      const { Jackpot, JackpotCore, Chainlink, TUSDC } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      const request = (await Chainlink.read.s_requests([1n]))

      expect(request[1]).to.be.equal(false)

      expect(await JackpotCore.read.results([1n])).to.be.deep.equal([0n, 0n, 0n, 0n, 0n])

      // gameRounds should be 1 and gameTickets should be 1
      expect(await JackpotCore.read.gameRounds()).to.be.equal(1n)

      expect(await JackpotCore.read.gameTickets()).to.be.equal(1n)

      expect(await Chainlink.read.getNumberOfRandomRequests()).to.be.equal(1n)

    });


    it("Should make random request and receive random number, state should be updated", async function () {

      const { Jackpot, JackpotCore, Chainlink, TUSDC, VRFCoordinatorV2Mock, VRFV2Wrapper } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWords([1n, VRFV2Wrapper.address])

      const request = (await Chainlink.read.s_requests([1n]))

      expect(request[1]).to.be.equal(true)

      expect(await JackpotCore.read.results([1n])).to.not.deep.equal([[0n], [0n],[0n],[0n],[0n]])

      expect(await JackpotCore.read.gameRounds()).to.be.equal(2n)

      expect(await JackpotCore.read.gameTickets()).to.be.equal(0n)

    });

  });


  describe("Testing Results", function () {


    it("Should Return true on pot1 when one prediction matches the results", async function () {

      const { Jackpot, JackpotCore, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC } = await loadFixture(deployTest);


      const tickets = [
        ticket(11, 12, 30, 50, 20),
        ticket(10, 20, 30, 50, 20),
        ticket(10, 10, 40, 50, 20),
        ticket(10, 10, 30, 91, 20),
        ticket(10, 10, 30, 50, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      expect(await JackpotCore.read.getPotsWon([1n, 1n])).to.be.deep.equal([true, false, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 2n])).to.be.deep.equal([true, false, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 3n])).to.be.deep.equal([true, false, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 4n])).to.be.deep.equal([true, false, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 5n])).to.be.deep.equal([true, false, false, false, false])

    });

    it("Should Return true on pot1 and pot2 when two prediction matches the results", async function () {

      const { Jackpot, JackpotCore, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 1, 1, 1),
        ticket(11, 1, 40, 1, 1),
        ticket(11, 1, 1, 91, 1),
        ticket(11, 1, 1, 1, 100),
        ticket(1, 20, 40, 1, 1),
        ticket(1, 20, 1, 91, 1),
        ticket(1, 20, 1, 1, 100),
        ticket(1, 1, 40, 91, 1),
        ticket(1, 1, 40, 1, 100),
        ticket(1, 1, 1, 91, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      expect(await JackpotCore.read.getPotsWon([1n, 1n])).to.be.deep.equal([true, true, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 2n])).to.be.deep.equal([true, true, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 3n])).to.be.deep.equal([true, true, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 4n])).to.be.deep.equal([true, true, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 5n])).to.be.deep.equal([true, true, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 6n])).to.be.deep.equal([true, true, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 7n])).to.be.deep.equal([true, true, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 8n])).to.be.deep.equal([true, true, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 9n])).to.be.deep.equal([true, true, false, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 10n])).to.be.deep.equal([true, true, false, false, false])

    });


    it("Should Return true on pot1, pot2, and pot3 when three prediction matches the results", async function () {

      const { Jackpot, JackpotCore, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 40, 1, 1),
        ticket(11, 20, 1, 91, 1),
        ticket(11, 20, 1, 1, 100),
        ticket(11, 1, 40, 91, 1),
        ticket(11, 1, 40, 1, 100),
        ticket(11, 1, 1, 91, 100),
        ticket(1, 20, 40, 91, 1),
        ticket(1, 20, 40, 1, 100),
        ticket(1, 20, 1, 91, 100),
        ticket(1, 1, 40, 91, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      expect(await JackpotCore.read.getPotsWon([1n, 1n])).to.be.deep.equal([true, true, true, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 2n])).to.be.deep.equal([true, true, true, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 3n])).to.be.deep.equal([true, true, true, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 4n])).to.be.deep.equal([true, true, true, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 5n])).to.be.deep.equal([true, true, true, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 6n])).to.be.deep.equal([true, true, true, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 7n])).to.be.deep.equal([true, true, true, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 8n])).to.be.deep.equal([true, true, true, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 9n])).to.be.deep.equal([true, true, true, false, false])

      expect(await JackpotCore.read.getPotsWon([1n, 10n])).to.be.deep.equal([true, true, true, false, false])

    });


    it("Should Return true on pot1, pot2, pot3, and pot4 when four prediction matches the results", async function () {

      const { Jackpot, JackpotCore, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 40, 91, 1),
        ticket(11, 20, 40, 1, 100),
        ticket(11, 20, 1, 91, 100),
        ticket(11, 1, 40, 91, 100),
        ticket(1, 20, 40, 91, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      expect(await JackpotCore.read.getPotsWon([1n, 1n])).to.be.deep.equal([true, true, true, true, false])

      expect(await JackpotCore.read.getPotsWon([1n, 2n])).to.be.deep.equal([true, true, true, true, false])

      expect(await JackpotCore.read.getPotsWon([1n, 3n])).to.be.deep.equal([true, true, true, true, false])

      expect(await JackpotCore.read.getPotsWon([1n, 4n])).to.be.deep.equal([true, true, true, true, false])

      expect(await JackpotCore.read.getPotsWon([1n, 5n])).to.be.deep.equal([true, true, true, true, false])

    });


    it("Should Return true on all pots when prediction matches all results", async function () {

      const { Jackpot, JackpotCore, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 40, 91, 100),
        ticket(10, 90, 30, 50, 20),

      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      expect(await JackpotCore.read.getPotsWon([1n, 1n])).to.be.deep.equal([true, true, true, true, true])

    });


  });





  describe("When Player win pot One", function () {

    it("Should Create and fund pot one", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, Vaults, LendingProtocol } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 12, 30, 50, 20),
        ticket(10, 20, 30, 50, 20),
        ticket(10, 10, 40, 50, 20),
        ticket(10, 10, 30, 91, 20),
        ticket(10, 10, 30, 50, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      await flashloan(TUSDC, LendingProtocol)

      const Vault1 = await hre.viem.getContractAt("Vault", Vaults[0])

      const interest = await Vault1.read.tokenInterest([TUSDC.address])

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      const potAddress = await Vault1.read.pots([1n])

      expect(await TUSDC.read.balanceOf([potAddress])).to.be.equal(interest)

    });

    it("Player should be able to withdraw from pot 1, with winning ticket", async function () {

      const { user1, Jackpot, JackpotCore, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, Vaults, LendingProtocol } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 1, 1, 1, 1),
        ticket(1, 20, 1, 1, 1),
        ticket(1, 1, 40, 1, 1),
        ticket(1, 1, 1, 91, 1),
        ticket(1, 1, 1, 1, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      await flashloan(TUSDC, LendingProtocol)

      const Vault1 = await hre.viem.getContractAt("Vault", Vaults[0])

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      const pot1Address = await Vault1.read.pots([1n])

      const Pot1 = await hre.viem.getContractAt("Pot", pot1Address)

      const playerBalance = await TUSDC.read.balanceOf([user1.account.address])

      const initialPotBal = await TUSDC.read.balanceOf([pot1Address])

      await Jackpot.write.claimTicket([1n, 3n])

      const totalWinners = await Pot1.read.totalWinners()

      const winnersShare =  initialPotBal / totalWinners;

      expect(totalWinners).to.be.equal(5n);

      expect(await TUSDC.read.balanceOf([pot1Address])).to.be.equal(initialPotBal - winnersShare)

      expect(await TUSDC.read.balanceOf([user1.account.address])).to.be.equal(playerBalance + testUSDCPrice.toBigInt() + winnersShare);

      expect((await JackpotCore.read.tickets([1n, 3n]))[2]).to.be.true;

    });

  });




  describe("When Player win Two pots", function () {

    it("Should Create and fund pot one and two", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, Vaults, LendingProtocol } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 1, 1, 1),
        ticket(11, 1, 40, 1, 1),
        ticket(11, 1, 1, 91, 1),
        ticket(11, 1, 1, 1, 100),
        ticket(1, 20, 40, 1, 1),
        ticket(1, 20, 1, 91, 1),
        ticket(1, 20, 1, 1, 100),
        ticket(1, 1, 40, 91, 1),
        ticket(1, 1, 40, 1, 100),
        ticket(1, 1, 1, 91, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);
      await flashloan(TUSDC, LendingProtocol)

      const Vault1 = await hre.viem.getContractAt("Vault", Vaults[0])

      const interest1 = await Vault1.read.tokenInterest([TUSDC.address])

      const Vault2 = await hre.viem.getContractAt("Vault", Vaults[1])

      const interest2 = await Vault2.read.tokenInterest([TUSDC.address])

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      const potAddress1 = await Vault1.read.pots([1n])
      const potAddress2 = await Vault2.read.pots([1n])

      expect(await TUSDC.read.balanceOf([potAddress1])).to.be.equal(interest1)
      expect(await TUSDC.read.balanceOf([potAddress2])).to.be.equal(interest2)


    });

    it("Player should be able to withdraw from pot 1 and 2, with winning ticket", async function () {

      const { user1, Jackpot, JackpotCore, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, Vaults, LendingProtocol } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 1, 1, 1),
        ticket(11, 1, 40, 1, 1),
        ticket(11, 1, 1, 91, 1),
        ticket(11, 1, 1, 1, 100),
        ticket(1, 20, 40, 1, 1),
        ticket(1, 20, 1, 91, 1),
        ticket(1, 20, 1, 1, 100),
        ticket(1, 1, 40, 91, 1),
        ticket(1, 1, 40, 1, 100),
        ticket(1, 1, 1, 91, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      await flashloan(TUSDC, LendingProtocol)

      const Vault1 = await hre.viem.getContractAt("Vault", Vaults[0])

      const Vault2 = await hre.viem.getContractAt("Vault", Vaults[1])

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      const pot1Address = await Vault1.read.pots([1n])

      const Pot1 = await hre.viem.getContractAt("Pot", pot1Address)

      const pot2Address = await Vault2.read.pots([1n])

      const Pot2 = await hre.viem.getContractAt("Pot", pot2Address)

      const playerBalance = await TUSDC.read.balanceOf([user1.account.address])

      const initialPot1Bal = await TUSDC.read.balanceOf([pot1Address])

      const initialPot2Bal = await TUSDC.read.balanceOf([pot2Address])

      await Jackpot.write.claimTicket([1n, 3n])

      const totalWinners1 = await Pot1.read.totalWinners()

      const winnersShare1 =  initialPot1Bal / totalWinners1;

      const totalWinners2 = await Pot2.read.totalWinners()

      const winnersShare2 =  initialPot2Bal / totalWinners2;

      expect(totalWinners1).to.be.equal(20n);

      expect(totalWinners2).to.be.equal(10n);

      expect(await TUSDC.read.balanceOf([pot1Address])).to.be.equal(initialPot1Bal - winnersShare1 * 2n)

      expect(await TUSDC.read.balanceOf([pot2Address])).to.be.equal(initialPot2Bal - winnersShare2)

      expect(await TUSDC.read.balanceOf([user1.account.address])).to.be.equal(playerBalance + testUSDCPrice.toBigInt() + winnersShare1 * 2n + winnersShare2);

      expect((await JackpotCore.read.tickets([1n, 3n]))[2]).to.be.true;

    });

  });




  describe("When Player win Three pots", function () {

    it("Should Create and fund pot one, two and three", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, Vaults, LendingProtocol } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 40, 1, 1),
        ticket(11, 20, 1, 91, 1),
        ticket(11, 20, 1, 1, 100),
        ticket(11, 1, 40, 91, 1),
        ticket(11, 1, 40, 1, 100),
        ticket(11, 1, 1, 91, 100),
        ticket(1, 20, 40, 91, 1),
        ticket(1, 20, 40, 1, 100),
        ticket(1, 20, 1, 91, 100),
        ticket(1, 1, 40, 91, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);
      await flashloan(TUSDC, LendingProtocol)

      const Vault1 = await hre.viem.getContractAt("Vault", Vaults[0])

      const interest1 = await Vault1.read.tokenInterest([TUSDC.address])

      const Vault2 = await hre.viem.getContractAt("Vault", Vaults[1])

      const interest2 = await Vault2.read.tokenInterest([TUSDC.address])

      const Vault3 = await hre.viem.getContractAt("Vault", Vaults[2])

      const interest3 = await Vault3.read.tokenInterest([TUSDC.address])

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      const potAddress1 = await Vault1.read.pots([1n])
      const potAddress2 = await Vault2.read.pots([1n])
      const potAddress3 = await Vault3.read.pots([1n])

      expect(await TUSDC.read.balanceOf([potAddress1])).to.be.equal(interest1)
      expect(await TUSDC.read.balanceOf([potAddress2])).to.be.equal(interest2)
      expect(await TUSDC.read.balanceOf([potAddress3])).to.be.equal(interest3)


    });

    it("Player should be able to withdraw from pot 1, 2 and 3, with winning ticket", async function () {

      const { user1, Jackpot, JackpotCore, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, Vaults, LendingProtocol } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 40, 1, 1),
        ticket(11, 20, 1, 91, 1),
        ticket(11, 20, 1, 1, 100),
        ticket(11, 1, 40, 91, 1),
        ticket(11, 1, 40, 1, 100),
        ticket(11, 1, 1, 91, 100),
        ticket(1, 20, 40, 91, 1),
        ticket(1, 20, 40, 1, 100),
        ticket(1, 20, 1, 91, 100),
        ticket(1, 1, 40, 91, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      await flashloan(TUSDC, LendingProtocol)

      const Vault1 = await hre.viem.getContractAt("Vault", Vaults[0])

      const Vault2 = await hre.viem.getContractAt("Vault", Vaults[1])

      const Vault3 = await hre.viem.getContractAt("Vault", Vaults[2])

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      const pot1Address = await Vault1.read.pots([1n])

      const Pot1 = await hre.viem.getContractAt("Pot", pot1Address)

      const pot2Address = await Vault2.read.pots([1n])

      const Pot2 = await hre.viem.getContractAt("Pot", pot2Address)

      const pot3Address = await Vault3.read.pots([1n])

      const Pot3 = await hre.viem.getContractAt("Pot", pot3Address)

      const playerBalance = await TUSDC.read.balanceOf([user1.account.address])

      const initialPot1Bal = await TUSDC.read.balanceOf([pot1Address])

      const initialPot2Bal = await TUSDC.read.balanceOf([pot2Address])

      const initialPot3Bal = await TUSDC.read.balanceOf([pot3Address])

      await Jackpot.write.claimTicket([1n, 3n])

      const totalWinners1 = await Pot1.read.totalWinners()

      const winnersShare1 =  initialPot1Bal / totalWinners1;

      const totalWinners2 = await Pot2.read.totalWinners()

      const winnersShare2 =  initialPot2Bal / totalWinners2;

      const totalWinners3 = await Pot3.read.totalWinners()

      const winnersShare3 =  initialPot3Bal / totalWinners3;

      expect(totalWinners1).to.be.equal(30n);

      expect(totalWinners2).to.be.equal(30n);

      expect(totalWinners3).to.be.equal(10n);

      expect(await TUSDC.read.balanceOf([pot1Address])).to.be.equal(initialPot1Bal - winnersShare1 * 3n)

      expect(await TUSDC.read.balanceOf([pot2Address])).to.be.equal(initialPot2Bal - winnersShare2 * 3n)

      expect(await TUSDC.read.balanceOf([pot3Address])).to.be.equal(initialPot3Bal - winnersShare3)

      expect(await TUSDC.read.balanceOf([user1.account.address])).to.be.equal(playerBalance + testUSDCPrice.toBigInt() + winnersShare1 * 3n + winnersShare2 * 3n + winnersShare3);

      expect((await JackpotCore.read.tickets([1n, 3n]))[2]).to.be.true;

    });

  });


  describe("When Player win Four pots", function () {

    it("Should Create and fund pot one, two, three and four", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, Vaults, LendingProtocol } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 40, 91, 1),
        ticket(11, 20, 40, 1, 100),
        ticket(11, 20, 1, 91, 100),
        ticket(11, 1, 40, 91, 100),
        ticket(1, 20, 40, 91, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);
      await flashloan(TUSDC, LendingProtocol)

      const Vault1 = await hre.viem.getContractAt("Vault", Vaults[0])

      const interest1 = await Vault1.read.tokenInterest([TUSDC.address])

      const Vault2 = await hre.viem.getContractAt("Vault", Vaults[1])

      const interest2 = await Vault2.read.tokenInterest([TUSDC.address])

      const Vault3 = await hre.viem.getContractAt("Vault", Vaults[2])

      const interest3 = await Vault3.read.tokenInterest([TUSDC.address])

      const Vault4 = await hre.viem.getContractAt("Vault", Vaults[3])

      const interest4 = await Vault4.read.tokenInterest([TUSDC.address])

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      const potAddress1 = await Vault1.read.pots([1n])
      const potAddress2 = await Vault2.read.pots([1n])
      const potAddress3 = await Vault3.read.pots([1n])
      const potAddress4 = await Vault4.read.pots([1n])

      expect(await TUSDC.read.balanceOf([potAddress1])).to.be.equal(interest1)
      expect(await TUSDC.read.balanceOf([potAddress2])).to.be.equal(interest2)
      expect(await TUSDC.read.balanceOf([potAddress3])).to.be.equal(interest3)
      expect(await TUSDC.read.balanceOf([potAddress4])).to.be.equal(interest4)


    });

    it("Player should be able to withdraw from pot 1, 2, 3, and 4 with winning ticket", async function () {

      const { user1, Jackpot, JackpotCore, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, Vaults, LendingProtocol } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 40, 91, 1),
        ticket(11, 20, 40, 1, 100),
        ticket(11, 20, 1, 91, 100),
        ticket(11, 1, 40, 91, 100),
        ticket(1, 20, 40, 91, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      await flashloan(TUSDC, LendingProtocol)

      const Vault1 = await hre.viem.getContractAt("Vault", Vaults[0])

      const Vault2 = await hre.viem.getContractAt("Vault", Vaults[1])

      const Vault3 = await hre.viem.getContractAt("Vault", Vaults[2])

      const Vault4 = await hre.viem.getContractAt("Vault", Vaults[3])

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      const pot1Address = await Vault1.read.pots([1n])

      const Pot1 = await hre.viem.getContractAt("Pot", pot1Address)

      const pot2Address = await Vault2.read.pots([1n])

      const Pot2 = await hre.viem.getContractAt("Pot", pot2Address)

      const pot3Address = await Vault3.read.pots([1n])

      const Pot3 = await hre.viem.getContractAt("Pot", pot3Address)

      const pot4Address = await Vault4.read.pots([1n])

      const Pot4 = await hre.viem.getContractAt("Pot", pot4Address)

      const playerBalance = await TUSDC.read.balanceOf([user1.account.address])

      const initialPot1Bal = await TUSDC.read.balanceOf([pot1Address])

      const initialPot2Bal = await TUSDC.read.balanceOf([pot2Address])

      const initialPot3Bal = await TUSDC.read.balanceOf([pot3Address])

      const initialPot4Bal = await TUSDC.read.balanceOf([pot4Address])

      await Jackpot.write.claimTicket([1n, 3n])

      const totalWinners1 = await Pot1.read.totalWinners()

      const winnersShare1 =  initialPot1Bal / totalWinners1;

      const totalWinners2 = await Pot2.read.totalWinners()

      const winnersShare2 =  initialPot2Bal / totalWinners2;

      const totalWinners3 = await Pot3.read.totalWinners()

      const winnersShare3 =  initialPot3Bal / totalWinners3;

      const totalWinners4 = await Pot4.read.totalWinners()

      const winnersShare4 =  initialPot4Bal / totalWinners4;

      expect(totalWinners1).to.be.equal(20n);

      expect(totalWinners2).to.be.equal(30n);

      expect(totalWinners3).to.be.equal(20n);

      expect(totalWinners4).to.be.equal(5n);

      expect(await TUSDC.read.balanceOf([pot1Address])).to.be.equal(initialPot1Bal - winnersShare1 * 4n)

      expect(await TUSDC.read.balanceOf([pot2Address])).to.be.equal(initialPot2Bal - winnersShare2 * 6n)

      expect(await TUSDC.read.balanceOf([pot3Address])).to.be.equal(initialPot3Bal - winnersShare3 * 4n)

      expect(await TUSDC.read.balanceOf([pot4Address])).to.be.equal(initialPot4Bal - winnersShare4)

      expect(await TUSDC.read.balanceOf([user1.account.address])).to.be.equal(playerBalance + testUSDCPrice.toBigInt() + winnersShare1 * 4n + winnersShare2 * 6n + winnersShare3 * 4n + winnersShare4);

      expect((await JackpotCore.read.tickets([1n, 3n]))[2]).to.be.true;
    });

  });




  describe("When Player win Five pots", function () {

    it("Should Create and fund pot one, two, three, four and five", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, Vaults, LendingProtocol } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 40, 91, 100)
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);
      await flashloan(TUSDC, LendingProtocol)

      const Vault1 = await hre.viem.getContractAt("Vault", Vaults[0])

      const interest1 = await Vault1.read.tokenInterest([TUSDC.address])

      const Vault2 = await hre.viem.getContractAt("Vault", Vaults[1])

      const interest2 = await Vault2.read.tokenInterest([TUSDC.address])

      const Vault3 = await hre.viem.getContractAt("Vault", Vaults[2])

      const interest3 = await Vault3.read.tokenInterest([TUSDC.address])

      const Vault4 = await hre.viem.getContractAt("Vault", Vaults[3])

      const interest4 = await Vault4.read.tokenInterest([TUSDC.address])

      const Vault5 = await hre.viem.getContractAt("Vault", Vaults[4])

      const interest5 = await Vault4.read.tokenInterest([TUSDC.address])

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      const potAddress1 = await Vault1.read.pots([1n])
      const potAddress2 = await Vault2.read.pots([1n])
      const potAddress3 = await Vault3.read.pots([1n])
      const potAddress4 = await Vault4.read.pots([1n])
      const potAddress5 = await Vault5.read.pots([1n])

      expect(await TUSDC.read.balanceOf([potAddress1])).to.be.equal(interest1)
      expect(await TUSDC.read.balanceOf([potAddress2])).to.be.equal(interest2)
      expect(await TUSDC.read.balanceOf([potAddress3])).to.be.equal(interest3)
      expect(await TUSDC.read.balanceOf([potAddress4])).to.be.equal(interest4)
      expect(await TUSDC.read.balanceOf([potAddress5])).to.be.equal(interest5)

    });

    it("Player should be able to withdraw from pot 1, 2, 3, 4, and 5 with winning ticket", async function () {

      const { user1, Jackpot, JackpotCore, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, Vaults, LendingProtocol } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 40, 91, 100)
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      await flashloan(TUSDC, LendingProtocol)

      const Vault1 = await hre.viem.getContractAt("Vault", Vaults[0])

      const Vault2 = await hre.viem.getContractAt("Vault", Vaults[1])

      const Vault3 = await hre.viem.getContractAt("Vault", Vaults[2])

      const Vault4 = await hre.viem.getContractAt("Vault", Vaults[3])

      const Vault5 = await hre.viem.getContractAt("Vault", Vaults[4])

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

      const pot1Address = await Vault1.read.pots([1n])

      const Pot1 = await hre.viem.getContractAt("Pot", pot1Address)

      const pot2Address = await Vault2.read.pots([1n])

      const Pot2 = await hre.viem.getContractAt("Pot", pot2Address)

      const pot3Address = await Vault3.read.pots([1n])

      const Pot3 = await hre.viem.getContractAt("Pot", pot3Address)

      const pot4Address = await Vault4.read.pots([1n])

      const Pot4 = await hre.viem.getContractAt("Pot", pot4Address)

      const pot5Address = await Vault5.read.pots([1n])

      const Pot5 = await hre.viem.getContractAt("Pot", pot5Address)

      const playerBalance = await TUSDC.read.balanceOf([user1.account.address])

      const initialPot1Bal = await TUSDC.read.balanceOf([pot1Address])

      const initialPot2Bal = await TUSDC.read.balanceOf([pot2Address])

      const initialPot3Bal = await TUSDC.read.balanceOf([pot3Address])

      const initialPot4Bal = await TUSDC.read.balanceOf([pot4Address])

      const initialPot5Bal = await TUSDC.read.balanceOf([pot5Address])

      await Jackpot.write.claimTicket([1n, 1n])

      const totalWinners1 = await Pot1.read.totalWinners()

      const winnersShare1 =  initialPot1Bal / totalWinners1;

      const totalWinners2 = await Pot2.read.totalWinners()

      const winnersShare2 =  initialPot2Bal / totalWinners2;

      const totalWinners3 = await Pot3.read.totalWinners()

      const winnersShare3 =  initialPot3Bal / totalWinners3;

      const totalWinners4 = await Pot4.read.totalWinners()

      const winnersShare4 =  initialPot4Bal / totalWinners4;

      const totalWinners5 = await Pot5.read.totalWinners()

      const winnersShare5 =  initialPot5Bal / totalWinners5;

      expect(totalWinners1).to.be.equal(5n);

      expect(totalWinners2).to.be.equal(10n);

      expect(totalWinners3).to.be.equal(10n);

      expect(totalWinners4).to.be.equal(5n);

      expect(totalWinners5).to.be.equal(1n);

      expect(await TUSDC.read.balanceOf([pot1Address])).to.be.equal(initialPot1Bal - winnersShare1 * 5n)

      expect(await TUSDC.read.balanceOf([pot2Address])).to.be.equal(initialPot2Bal - winnersShare2 * 10n)

      expect(await TUSDC.read.balanceOf([pot3Address])).to.be.equal(initialPot3Bal - winnersShare3 * 10n)

      expect(await TUSDC.read.balanceOf([pot4Address])).to.be.equal(initialPot4Bal - winnersShare4 * 5n)

      expect(await TUSDC.read.balanceOf([pot5Address])).to.be.equal(initialPot5Bal - winnersShare5)

      expect(await TUSDC.read.balanceOf([user1.account.address])).to.be.equal(playerBalance + testUSDCPrice.toBigInt() + winnersShare1 * 5n + winnersShare2 * 10n + winnersShare3 * 10n + winnersShare4 * 5n + winnersShare5);

      expect((await JackpotCore.read.tickets([1n, 1n]))[2]).to.be.true;

    });

  });


  describe("Getters", function () {

    it("Get all my the tickets", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC, LendingProtocol, user1 } = await loadFixture(deployTest);

      const tickets = [
        ticket(11, 20, 40, 1, 1),
        ticket(11, 20, 1, 91, 1),
        ticket(11, 20, 1, 1, 100),
        ticket(11, 1, 40, 91, 1),
        ticket(11, 1, 40, 1, 100),
        ticket(11, 1, 1, 91, 100),
        ticket(1, 20, 40, 91, 1),
        ticket(1, 20, 40, 1, 100),
        ticket(1, 20, 1, 91, 100),
        ticket(1, 1, 40, 91, 100),
      ]

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, tickets]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);
      await flashloan(TUSDC, LendingProtocol)

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWordsWithOverride([
        1n, VRFV2Wrapper.address, [10, 19, 39, 90, 99]
      ]);

    });

  });

});
