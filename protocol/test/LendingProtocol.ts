import {loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { deployLendingProtocol, deployLendingProtocolInitVaults, vaultShare } from "../scripts/helper";
import { ethers } from "ethers";

describe("LendingProtocol", function () {


  describe("When Lender is not initialized in vault ", function () {
    
    it("Flash Loan should revert with CallerIsNotLendingProtocol()", async function () {

      const { LendingProtocol, TUSDC } = await loadFixture(deployLendingProtocol);

      const funds = ethers.utils.parseUnits("100000","ether")

      const fundsToBorrow = ethers.utils.parseUnits("1000","ether")

      await TUSDC.write.transfer([LendingProtocol.address, funds.toBigInt()])

      const BorrowerContract = await hre.viem.deployContract("FlashBorrowerExample")

      await TUSDC.write.transfer([BorrowerContract.address,  BigInt(10e20)])

      await expect(LendingProtocol.write.flashLoan([
        TUSDC.address, BorrowerContract.address, fundsToBorrow.toBigInt()
      ])).to.be.rejectedWith("CallerIsNotLendingProtocol()")

    });
  
  });


  describe(" When Lender is initialized in vault", function () {
    
    it("Flash Loan should increase protocol balance by 0.9%", async function () {

      const { LendingProtocol, TUSDC } = await loadFixture(deployLendingProtocolInitVaults);

      const funds = ethers.utils.parseUnits("100000","ether")

      const fundsToBorrow = ethers.utils.parseUnits("1000","ether")

      await TUSDC.write.transfer([LendingProtocol.address, funds.toBigInt()])

      const protocolBalance = await TUSDC.read.balanceOf([LendingProtocol.address])

      const BorrowerContract = await hre.viem.deployContract("FlashBorrowerExample")

      await TUSDC.write.transfer([BorrowerContract.address,  BigInt(10e20)])

      await LendingProtocol.write.flashLoan([TUSDC.address, BorrowerContract.address, fundsToBorrow.toBigInt()])

      expect(
        await TUSDC.read.balanceOf([LendingProtocol.address])
      ).to.be.equal((fundsToBorrow.mul(9).div(1000).add(protocolBalance)).toBigInt())

    });


    it("Flash Loan should increase value balance by vault share of interest Percentage", async function () {

      const { LendingProtocol, TUSDC, Vault1, Vault2, Vault3, Vault4, Vault5, DAOVault } = await loadFixture(deployLendingProtocolInitVaults);

      const funds = ethers.utils.parseUnits("100000","ether")

      const fundsToBorrow = ethers.utils.parseUnits("1000","ether")

      await TUSDC.write.transfer([LendingProtocol.address, funds.toBigInt()])

      const BorrowerContract = await hre.viem.deployContract("FlashBorrowerExample")

      await TUSDC.write.transfer([BorrowerContract.address,  BigInt(10e20)])

      await LendingProtocol.write.flashLoan([TUSDC.address, BorrowerContract.address, fundsToBorrow.toBigInt()])

      const interest = fundsToBorrow.mul(9).div(1000)

      expect(
        await Vault1.read.tokenInterest([TUSDC.address])
      ).to.be.equal(interest.mul(vaultShare[0]).div(1000).toBigInt())


      expect(
        await Vault2.read.tokenInterest([TUSDC.address])
      ).to.be.equal(interest.mul(vaultShare[1]).div(1000).toBigInt())


      expect(
        await Vault3.read.tokenInterest([TUSDC.address])
      ).to.be.equal(interest.mul(vaultShare[2]).div(1000).toBigInt())


      expect(
        await Vault4.read.tokenInterest([TUSDC.address])
      ).to.be.equal(interest.mul(vaultShare[3]).div(1000).toBigInt())


      expect(
        await Vault5.read.tokenInterest([TUSDC.address])
      ).to.be.equal(interest.mul(vaultShare[4]).div(1000).toBigInt())


      expect(
        await DAOVault.read.tokenInterest([TUSDC.address])
      ).to.be.equal(interest.mul(vaultShare[5]).div(1000).toBigInt())

    });

  });


  
});
