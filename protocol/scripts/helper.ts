import hre from "hardhat";
import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Address } from "viem";

export const LENDING_PROTOCOL = process.env.LENDING_PROTOCOL as Address
export const TEST_USDC = process.env.TEST_USDC as Address
export const CHAINLINK = process.env.CHAINLINK as Address

export const vaultShare = [BigInt(25), BigInt(15), BigInt(15), BigInt(15), BigInt(15), BigInt(10), 5n]

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


export async function deploy(LinkToken: any, VRFV2Wrapper: any, VRFCoordinatorV2Mock: any = null, MockV3Aggregator: any = null) {

  // Contracts are deployed using the first signer/account by default
  const [user1, user2] = await hre.viem.getWalletClients();

  const TUSDC = await hre.viem.deployContract("TestUSDC");

  const Vault = await hre.viem.deployContract("Vault");

  const Pot = await hre.viem.deployContract("Pot");

  const LendingProtocol = await hre.viem.deployContract("LendingProtocol");

  // Deploying Governance

  const DAOVault = await hre.viem.deployContract("DAOVault");

  const GovernorVault = await hre.viem.deployContract("GovernorVault");
  
  const Governance = await hre.viem.deployContract("Governance", [GovernorVault.address]);

  const GovernanceToken = await hre.viem.deployContract("GovernanceToken", [Governance.address]);

  await Governance.write.init([GovernanceToken.address, DAOVault.address])

  // Deploying Protocol
  const Chainlink = await hre.viem.deployContract("Chainlink", [LinkToken.address, VRFV2Wrapper.address])

  const JackpotCore = await hre.viem.deployContract("JackpotCore");

  const Jackpot = await hre.viem.deployContract("Jackpot", [JackpotCore.address, LendingProtocol.address, Chainlink.address, Governance.address, GovernanceToken.address, DAOVault.address, Vault.address, Pot.address, TUSDC.address, testUSDCPrice.toBigInt()]);

  await LinkToken.write.transfer([Chainlink.address, oneHundredLink.toBigInt()])

  const Vaults = await Jackpot.read.vaultAddresses()

  const publicClient = await hre.viem.getPublicClient();

  return {
    Jackpot,
    JackpotCore,
    LendingProtocol,
    user1,
    user2,
    TUSDC,
    LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper,
    Chainlink,
    Vaults,
    Governance,
    GovernanceToken,
    GovernorVault,
    publicClient,
  };
}



export async function deployTest() {

  const { LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper } = await chainLinkConfig()

  const { user1, user2, Jackpot, JackpotCore, Governance, GovernanceToken, GovernorVault, LendingProtocol, TUSDC, Chainlink, Vaults, publicClient } = await deploy(LinkToken, VRFV2Wrapper, VRFCoordinatorV2Mock, MockV3Aggregator)
  
  return {
    Jackpot,
    JackpotCore,
    LendingProtocol,
    user1,
    user2,
    TUSDC,
    LinkToken, VRFCoordinatorV2Mock, MockV3Aggregator, VRFV2Wrapper,
    Chainlink,
    Vaults,
    Governance,
    GovernanceToken,
    GovernorVault,
    publicClient,
  };
}



export async function deployLendingProtocol() {

  // Contracts are deployed using the first signer/account by default
  const [user1, user2] = await hre.viem.getWalletClients();

  const TUSDC = await hre.viem.deployContract("TestUSDC");

  const Vault1 = await hre.viem.deployContract("Vault");

  const Vault2 = await hre.viem.deployContract("Vault");

  const Vault3 = await hre.viem.deployContract("Vault");

  const Vault4 = await hre.viem.deployContract("Vault");

  const Vault5 = await hre.viem.deployContract("Vault");

  const DAOVault = await hre.viem.deployContract("DAOVault");

  const CommunityVault = await hre.viem.deployContract("Vault");

  const LendingProtocol = await hre.viem.deployContract("LendingProtocol");

  await LendingProtocol.write.initialize([
    [Vault1.address, Vault2.address, Vault3.address, Vault4.address, Vault5.address, DAOVault.address, CommunityVault.address],
    vaultShare,
    TUSDC.address
  ])

  const publicClient = await hre.viem.getPublicClient();

  return {
    LendingProtocol,
    user1,
    user2,
    TUSDC,
    Vault1,
    Vault2,
    Vault3,
    Vault4,
    Vault5,
    DAOVault,
    CommunityVault,
    publicClient,
  };
}


export async function deployLendingProtocolInitVaults() {

  const {
    LendingProtocol,
    user1,
    user2,
    TUSDC,
    Vault1,
    Vault2,
    Vault3,
    Vault4,
    Vault5,
    DAOVault,
    CommunityVault,
    publicClient,
  } = await deployLendingProtocol()

  const Pot = await hre.viem.deployContract("Pot");

  await Vault1.write.initialize([LendingProtocol.address, Pot.address])
  await Vault2.write.initialize([LendingProtocol.address, Pot.address])
  await Vault3.write.initialize([LendingProtocol.address, Pot.address])
  await Vault4.write.initialize([LendingProtocol.address, Pot.address])
  await Vault5.write.initialize([LendingProtocol.address, Pot.address])
  await DAOVault.write.initialize([LendingProtocol.address, Pot.address])
  await CommunityVault.write.initialize([LendingProtocol.address, Pot.address])


  return {
    LendingProtocol,
    user1,
    user2,
    TUSDC,
    Vault1,
    Vault2,
    Vault3,
    Vault4,
    Vault5,
    DAOVault,
    CommunityVault,
    publicClient,
  };
}

export const ticket = (value1: number, value2: number,value3: number,value4: number,value5: number,) => {
  return { value1: BigInt(value1) , value2: BigInt(value2), value3: BigInt(value3), value4: BigInt(value4), value5: BigInt(value5) }
}





export async function flashloan(TUSDC: any, LendingProtocol: any) {

  const BorrowerContract = await hre.viem.deployContract("FlashBorrowerExample")

  await TUSDC.write.transfer([BorrowerContract.address,  BigInt(10e20)])

  const protocolBalance = await TUSDC.read.balanceOf([LendingProtocol.address])

  await LendingProtocol.write.flashLoan([TUSDC.address, BorrowerContract.address, protocolBalance])

}

function getRandomTicketValue(min: number = 1, max: number = 100) {
  return Math.floor(Math.random() * (max - min) + min);
}


export const generateTickets = (numberOfTickets: number) => {

  const tickets = []

  for (let i = 0; i < numberOfTickets; i++) {
    tickets.push(ticket(
      getRandomTicketValue(), 
      getRandomTicketValue(),
      getRandomTicketValue(),
      getRandomTicketValue(),
      getRandomTicketValue()
      )
    )
  }

  return tickets
}



export async function deployGovernanceTest() {

  // Contracts are deployed using the first signer/account by default
  const [user1, user2] = await hre.viem.getWalletClients();


  const { DAOVault, TUSDC } = await loadFixture(DAOVaultTest);

  const GovernorVault = await hre.viem.deployContract("GovernorVault");

  const Governance = await hre.viem.deployContract("Governance", [GovernorVault.address]);

  const GovernanceToken = await hre.viem.deployContract("GovernanceToken", [Governance.address]);

  await DAOVault.write.initGovernor([Governance.address])

  await Governance.write.init([GovernanceToken.address, DAOVault.address])

  await GovernanceToken.write.initFactory([user1.account.address])

  await GovernanceToken.write.mint([user1.account.address, ethers.utils.parseUnits("500","ether").toBigInt()])

  await GovernanceToken.write.mint([user2.account.address, ethers.utils.parseUnits("500","ether").toBigInt()])

  return {
    user1,
    user2,
    GovernanceToken,
    Governance,
    DAOVault,
    TUSDC
  };
}




export async function DAOVaultTest() {

  // Contracts are deployed using the first signer/account by default
  const [user1, user2] = await hre.viem.getWalletClients();

  const DAOVault = await hre.viem.deployContract("DAOVault");

  await DAOVault.write.initialize([user1.account.address, user1.account.address])

  const TUSDC = await hre.viem.deployContract("TestUSDC");

  const amount = ethers.utils.parseUnits("100","ether")

  await TUSDC.write.transfer([DAOVault.address, amount.toBigInt()])

  await DAOVault.write.addInterest([TUSDC.address, amount.toBigInt()])

  await DAOVault.write.initFactory([user1.account.address])

  await DAOVault.write.addSupportedToken([TUSDC.address])

  return {
    user1,
    user2,
    DAOVault,
    TUSDC,
  };
}

export const mineBlocks = async (hre: HardhatRuntimeEnvironment, minutes: number) => {
  await hre.network.provider.send("hardhat_mine", [ethers.utils.hexValue(minutes), "0x3c"]);
}

