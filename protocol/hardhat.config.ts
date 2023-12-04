import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import 'hardhat-abi-exporter';
import 'hardhat-contract-sizer';
import dotenv from 'dotenv'

dotenv.config()

// import "@nomiclabs/hardhat-etherscan";

const PRIVATE_KEY = String(process.env.PRIVATE_KEY)

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: "0.8.20",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: "0.8.18",
				settings: {},
			},
			{
				version: "0.4.24",
				settings: {},
			},
		],
	},
	abiExporter: [
		{
			path: '../src/abi',
			pretty: false,
			runOnCompile: true,
			only: [ "Jackpot", "LendingProtocol",  "Vault",  "DAOVault", "Pot", "Chainlink", "Governor", "TestUSDC" ]
		}
	],
	contractSizer: {
		alphaSort: true,
		disambiguatePaths: false,
		runOnCompile: true,
		strict: true,
		only: [ "Jackpot", "JackpotCore", "LendingProtocol",  "Vault",  "DAOVault", "Pot", "Chainlink", "Governor", "CloneFactory" ]
	},
	networks: {
		mumbai: {
			url: 'https://polygon-mumbai.g.alchemy.com/v2/1yHVzG9cEm8g0IJKQA0VO-nczdGW4NgO',
			accounts: [ PRIVATE_KEY ]
		},
		
	},
};

export default config;
