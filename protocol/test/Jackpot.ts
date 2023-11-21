import {loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { deployTest, testUSDCPrice, ticket } from "../scripts/helper";


const GAS_CALLBACK = BigInt(400000)

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
      const { Jackpot, TUSDC } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, testUSDCPrice.toBigInt()])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      expect(await Jackpot.read.gameRounds()).to.be.equal(1n);
      expect(await Jackpot.read.gameTickets()).to.be.equal(1n);

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

      const { Jackpot, Chainlink, TUSDC } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      const request = (await Chainlink.read.s_requests([1n]))

      expect(request[1]).to.be.equal(false)

      expect(await Jackpot.read.results([1n])).to.be.deep.equal([0n, 0n, 0n, 0n, 0n])

      // gameRounds should be 1 and gameTickets should be 1
      expect(await Jackpot.read.gameRounds()).to.be.equal(1n)

      expect(await Jackpot.read.gameTickets()).to.be.equal(1n)

      expect(await Chainlink.read.getNumberOfRandomRequests()).to.be.equal(1n)
      
    });


    it("Should make random request and receive random number, state should be updated", async function () {

      const { Jackpot, Chainlink, TUSDC, VRFCoordinatorV2Mock, VRFV2Wrapper } = await loadFixture(deployTest);

      await TUSDC.write.approve([Jackpot.address, BigInt(10e40)])

      await Jackpot.write.buyTickets([TUSDC.address, ticket1]);

      // Increase Time by 1hr 1 min
      await hre.network.provider.send("hardhat_mine", ["0x3D", "0x3c"]);

      await Chainlink.write.randomRequestRandomWords([GAS_CALLBACK]);

      await VRFCoordinatorV2Mock.write.fulfillRandomWords([1n, VRFV2Wrapper.address])

      const request = (await Chainlink.read.s_requests([1n]))

      expect(request[1]).to.be.equal(true)

      expect(await Jackpot.read.results([1n])).to.not.deep.equal([[0n], [0n],[0n],[0n],[0n]])

      expect(await Jackpot.read.gameRounds()).to.be.equal(2n)

      expect(await Jackpot.read.gameTickets()).to.be.equal(0n)
      
    });    

  });


  describe("Testing Results", function () {


    it("Should Return true on pot1 when one prediction matches the results", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC } = await loadFixture(deployTest);


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

      expect(await Jackpot.read.getPotsWon([1n, 1n])).to.be.deep.equal([true, false, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 2n])).to.be.deep.equal([true, false, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 3n])).to.be.deep.equal([true, false, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 4n])).to.be.deep.equal([true, false, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 5n])).to.be.deep.equal([true, false, false, false, false])

    });

    it("Should Return true on pot1 and pot2 when two prediction matches the results", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC } = await loadFixture(deployTest);

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

      expect(await Jackpot.read.getPotsWon([1n, 1n])).to.be.deep.equal([true, true, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 2n])).to.be.deep.equal([true, true, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 3n])).to.be.deep.equal([true, true, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 4n])).to.be.deep.equal([true, true, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 5n])).to.be.deep.equal([true, true, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 6n])).to.be.deep.equal([true, true, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 7n])).to.be.deep.equal([true, true, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 8n])).to.be.deep.equal([true, true, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 9n])).to.be.deep.equal([true, true, false, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 10n])).to.be.deep.equal([true, true, false, false, false])

    });


    it("Should Return true on pot1, pot2, and pot3 when three prediction matches the results", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC } = await loadFixture(deployTest);

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

      expect(await Jackpot.read.getPotsWon([1n, 1n])).to.be.deep.equal([true, true, true, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 2n])).to.be.deep.equal([true, true, true, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 3n])).to.be.deep.equal([true, true, true, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 4n])).to.be.deep.equal([true, true, true, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 5n])).to.be.deep.equal([true, true, true, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 6n])).to.be.deep.equal([true, true, true, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 7n])).to.be.deep.equal([true, true, true, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 8n])).to.be.deep.equal([true, true, true, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 9n])).to.be.deep.equal([true, true, true, false, false])

      expect(await Jackpot.read.getPotsWon([1n, 10n])).to.be.deep.equal([true, true, true, false, false])

    });


    it("Should Return true on pot1, pot2, pot3, and pot4 when four prediction matches the results", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC } = await loadFixture(deployTest);

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

      expect(await Jackpot.read.getPotsWon([1n, 1n])).to.be.deep.equal([true, true, true, true, false])

      expect(await Jackpot.read.getPotsWon([1n, 2n])).to.be.deep.equal([true, true, true, true, false])

      expect(await Jackpot.read.getPotsWon([1n, 3n])).to.be.deep.equal([true, true, true, true, false])

      expect(await Jackpot.read.getPotsWon([1n, 4n])).to.be.deep.equal([true, true, true, true, false])

      expect(await Jackpot.read.getPotsWon([1n, 5n])).to.be.deep.equal([true, true, true, true, false])

    });


    it("Should Return true on all pots when prediction matches all results", async function () {

      const { Jackpot, Chainlink, VRFCoordinatorV2Mock, VRFV2Wrapper, TUSDC } = await loadFixture(deployTest);

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

      expect(await Jackpot.read.getPotsWon([1n, 1n])).to.be.deep.equal([true, true, true, true, true])

    });


    

  });

  
});
