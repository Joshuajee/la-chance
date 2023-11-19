import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";
import { ethers } from "ethers";

export const testUSDCPrice = ethers.utils.parseUnits("10","ether")

export const BigNumber = ethers.BigNumber
export const pointOneLink = BigNumber.from("100000000000000000") // 0.1
export const pointZeroZeroThreeLink = BigNumber.from("3000000000000000") // 0.003
export const oneHundredLink = BigNumber.from("100000000000000000000") // 100 LINK
export const oneHundredGwei = BigNumber.from("100000000000")

const wrapperGasOverhead = BigNumber.from(60_000)
const coordinatorGasOverhead = BigNumber.from(52_000)
const wrapperPremiumPercentage = 10
const maxNumWords = 10
const weiPerUnitLink = pointZeroZeroThreeLink
const flatFee = pointOneLink


// This should match implementation in VRFV2Wrapper::calculateGasPriceInternal
export const calculatePrice = (
  gasLimit: any,
  _wrapperGasOverhead = wrapperGasOverhead,
  _coordinatorGasOverhead = coordinatorGasOverhead,
  _gasPriceWei = oneHundredGwei,
  _weiPerUnitLink = weiPerUnitLink,
  _wrapperPremium = wrapperPremiumPercentage,
  _flatFee = flatFee
) => {
  const totalGas = BigNumber.from(0)
      .add(gasLimit)
      .add(_wrapperGasOverhead)
      .add(_coordinatorGasOverhead)
  const baseFee = BigNumber.from("1000000000000000000")
      .mul(_gasPriceWei)
      .mul(totalGas)
      .div(_weiPerUnitLink)
  const withPremium = baseFee.mul(BigNumber.from(100).add(_wrapperPremium)).div(100)
  return withPremium.add(_flatFee)
}

export async function chainLinkConfig () {


  const LinkToken = await hre.viem.deployContract("LinkToken");

  const VRFCoordinatorV2Mock = await hre.viem.deployContract("VRFCoordinatorV2Mock", 
    [pointOneLink, 1e9]
  );

  const MockV3Aggregator = await hre.viem.deployContract("MockV3Aggregator", [18, weiPerUnitLink]);

  const VRFV2Wrapper = await hre.viem.deployContract("VRFV2Wrapper", [
    LinkToken.address,
    MockV3Aggregator.address,
    VRFCoordinatorV2Mock.address
  ]);

  const keyHash = "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc"


  await VRFV2Wrapper.write.setConfig([
    wrapperGasOverhead.toNumber(),
    coordinatorGasOverhead.toNumber(),
    wrapperPremiumPercentage,
    keyHash,
    maxNumWords
  ]);

  await VRFCoordinatorV2Mock.write.fundSubscription([1, oneHundredLink])

  return { LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper}

}

export async function deploy() {

  // Contracts are deployed using the first signer/account by default
  const [user1, user2] = await hre.viem.getWalletClients();

  const TUSDC = await hre.viem.deployContract("TestUSDC");

  const Vault = await hre.viem.deployContract("Vault");

  const LendingProtocol = await hre.viem.deployContract("LendingProtocol");

  const Jackpot = await hre.viem.deployContract("Jackpot", [TUSDC.address, TUSDC.address, LendingProtocol.address, Vault.address, TUSDC.address, testUSDCPrice.toBigInt()]);

  const publicClient = await hre.viem.getPublicClient();

  return {
    Jackpot,
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

  const Jackpot = await hre.viem.deployContract("Jackpot", [LinkToken.address, VRFV2Wrapper.address, LendingProtocol.address, Vault.address, TUSDC.address, testUSDCPrice.toBigInt()]);

  await LinkToken.write.transfer([Jackpot.address, oneHundredLink.toBigInt()])

  const publicClient = await hre.viem.getPublicClient();

  return {
    Jackpot,
    LendingProtocol,
    user1,
    user2,
    TUSDC,
    LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper,
    publicClient,
  };
}


export async function deployLendingProtocol() {

  // Contracts are deployed using the first signer/account by default
  const [user1, user2] = await hre.viem.getWalletClients();

  const TUSDC = await hre.viem.deployContract("TestUSDC");

  const Vault = await hre.viem.deployContract("Vault");

  const LendingProtocol = await hre.viem.deployContract("LendingProtocol");

  const { LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper } = await chainLinkConfig()

  const Jackpot = await hre.viem.deployContract("Jackpot", [LinkToken.address, VRFV2Wrapper.address, LendingProtocol.address, Vault.address, TUSDC.address, testUSDCPrice.toBigInt()]);

  await LinkToken.write.transfer([Jackpot.address, oneHundredLink.toBigInt()])

  const publicClient = await hre.viem.getPublicClient();

  return {
    Jackpot,
    LendingProtocol,
    user1,
    user2,
    TUSDC,
    LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper,
    publicClient,
  };
}

export const ticket = (value1: number, value2: number,value3: number,value4: number,value5: number,) => {

  return [{ value1: BigInt(value1) , value2: BigInt(value2), value3: BigInt(value3), value4: BigInt(value4), value5: BigInt(value5) }]
    //return [BigInt(value1), BigInt(value2), BigInt(value3), BigInt(value4), BigInt(value5)]
}

