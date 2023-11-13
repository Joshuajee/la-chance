import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";
import { ethers } from "ethers";

export const testUSDCPrice = ethers.utils.parseUnits("10","ether")

export async function deploy() {

    // Contracts are deployed using the first signer/account by default
    const [user1, user2] = await hre.viem.getWalletClients();

    const TUSDC = await hre.viem.deployContract("TestUSDC");

    const jackpotBase = await hre.viem.deployContract("JackpotBase", [TUSDC.address, testUSDCPrice]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      jackpotBase,
      user1,
      user2,
      publicClient,
      TUSDC
    };
}

export async function deployAndAddAcceptedToken() {

    const { jackpotBase, user1, user2, publicClient, TUSDC} = await loadFixture(deploy);

    //await jackpotBase.write.

    return {
      jackpotBase,
      user1,
      user2,
      publicClient,
      TUSDC
    };
}

export const ticket = (value1: number, value2: number,value3: number,value4: number,value5: number,) => {

    return [{ value1: BigInt(value1) , value2: BigInt(value2), value3: BigInt(value3), value4: BigInt(value4), value5: BigInt(value5) }]
    //return [BigInt(value1), BigInt(value2), BigInt(value3), BigInt(value4), BigInt(value5)]
}

