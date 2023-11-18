import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";
import { ethers } from "ethers";

export const testUSDCPrice = ethers.utils.parseUnits("10","ether")


export async function chainLinkConfig () {

  const LinkToken = await hre.viem.deployContract("LinkToken");

  const VRFCoordinatorV2Mock = await hre.viem.deployContract("VRFCoordinatorV2Mock", 
    [ethers.utils.parseUnits("0.1","ether"), 1000000000]
  );

  const MockV3Aggregator = await hre.viem.deployContract("MockV3Aggregator", [18, 3000000000000000]);

  const VRFV2Wrapper = await hre.viem.deployContract("VRFV2Wrapper", [
    LinkToken.address,
    MockV3Aggregator.address,
    VRFCoordinatorV2Mock.address
  ]);


  await VRFV2Wrapper.write.setConfig([
    60000,  52000,  10,
    "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    10
  ]);

  await VRFCoordinatorV2Mock.write.fundSubscription([1, "10000000000000000000"])

  return { LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper}

}

export async function deploy() {

  // Contracts are deployed using the first signer/account by default
  const [user1, user2] = await hre.viem.getWalletClients();

  const TUSDC = await hre.viem.deployContract("TestUSDC");

  const Vault = await hre.viem.deployContract("Vault");

  const LendingProtocol = await hre.viem.deployContract("LendingProtocol");

  const JackpotBase = await hre.viem.deployContract("JackpotBase", [TUSDC.address, TUSDC.address, LendingProtocol.address, Vault.address, TUSDC.address, testUSDCPrice.toBigInt()]);

  const publicClient = await hre.viem.getPublicClient();

  return {
    JackpotBase,
    LendingProtocol,
    user1,
    user2,
    TUSDC,
    publicClient,
  };
}


export async function deployTest() {

  // Contracts are deployed using the first signer/account by default
  const [user1, user2] = await hre.viem.getWalletClients();

  const TUSDC = await hre.viem.deployContract("TestUSDC");

  const Vault = await hre.viem.deployContract("Vault");

  const LendingProtocol = await hre.viem.deployContract("LendingProtocol");

  const { LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper } = await chainLinkConfig()

  const JackpotBase = await hre.viem.deployContract("JackpotBase", [LinkToken.address, VRFV2Wrapper.address, LendingProtocol.address, Vault.address, TUSDC.address, testUSDCPrice.toBigInt()]);

  await LinkToken.write.transfer([JackpotBase.address, ethers.utils.parseUnits("1000", "ether").toBigInt()])

  const publicClient = await hre.viem.getPublicClient();

  return {
    JackpotBase,
    LendingProtocol,
    user1,
    user2,
    TUSDC,
    LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper,
    publicClient,
  };
}

export async function deployAndAddAcceptedToken() {

    const { JackpotBase, user1, user2, publicClient, TUSDC} = await loadFixture(deploy);

    //await JackpotBase.write.

    return {
      JackpotBase,
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

