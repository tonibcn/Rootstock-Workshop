import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-ethers";
import "@nomiclabs/hardhat-solhint";
import "solidity-coverage";
import "dotenv/config";


// Importing custom tasks
import "./tasks/utils/accounts";
import "./tasks/utils/balance";
import "./tasks/utils/block-number";
import "./tasks/utils/send-eth";

import "./tasks/voting_tasks";


// Environment variable setup
//const RSK_MAINNET_RPC_URL = process.env.RSK_MAINNET_RPC_URL;
const RSK_TESTNET_RPC_URL = process.env.RSK_TESTNET_RPC_URL;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

// Ensure environment variables are configured
// if (!RSK_MAINNET_RPC_URL) {
//     throw new Error("The RPC URL for the mainnet is not configured.");
// }

if (!RSK_TESTNET_RPC_URL) { // Fixed duplicate check for RSK_MAINNET_RPC_URL
    throw new Error("The RPC URL for the testnet is not configured.");
}

if (!WALLET_PRIVATE_KEY) {
    throw new Error("Private key is not configured.");
}

// Hardhat configuration
const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            // If you want to do some forking, uncomment this
            // forking: {
            //   url: MAINNET_RPC_URL
            // }
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        // rskMainnet: {
        //     url: RSK_MAINNET_RPC_URL,
        //     chainId: 30,
        //     gasPrice: 60000000,
        //     accounts: [WALLET_PRIVATE_KEY]
        // },
        rskTestnet: {
            url: RSK_TESTNET_RPC_URL,
            chainId: 31,
            gasPrice: 60000000,
            accounts: [WALLET_PRIVATE_KEY]
        },
    },
    etherscan: {
        apiKey: {
            // Is not required by blockscout. Can be any non-empty string
            rsktestnet: 'your API key',
            rskmainnet: 'your API key'
        },
        customChains: [
            {
                network: "rsktestnet",
                chainId: 31,
                urls: {
                    apiURL: "https://rootstock-testnet.blockscout.com/api/",
                    browserURL: "https://rootstock-testnet.blockscout.com/",
                }
            },
            {
                network: "rskmainnet",
                chainId: 30,
                urls: {
                    apiURL: "https://rootstock.blockscout.com/api/",
                    browserURL: "https://rootstock.blockscout.com/",
                }
            },
        ]
    },
    namedAccounts: {
        deployer: {
            default: 0, // Default is the first account
            mainnet: 0,
        },
        owner: {
            default: 0,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.24",
            },
        ],
    },
};

export default config;
