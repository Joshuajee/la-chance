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
      only: [ "Jackpot", "LendingProtocol",  "Vault",  "DAOVault", "Pot", "TestUSDC" ]
		}
	],
	contractSizer: {
		alphaSort: true,
		disambiguatePaths: false,
		runOnCompile: true,
		strict: true,
    only: [ "Jackpot", "LendingProtocol",  "Vault",  "DAOVault", "Pot", "ChainlinkVRF" ]
	},
	networks: {
		polygon_zkevm: {
			url: "https://rpc.public.zkevm-test.net/",
			accounts: [PRIVATE_KEY]
		},
		scroll_sepolia: {
			url: "https://sly-stylish-field.scroll-testnet.quiknode.pro/4196b86d0efc48afd45910796f7285dcf01d41c4/",
			accounts: [PRIVATE_KEY],
		},
		mumbai: {
			url: 'https://polygon-mumbai.g.alchemy.com/v2/1yHVzG9cEm8g0IJKQA0VO-nczdGW4NgO',
			accounts: [ PRIVATE_KEY ]
		},
		
	},
};

export default config;
