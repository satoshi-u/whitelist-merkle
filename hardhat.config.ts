import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades'; // this allows to get {upgrades, ethers} from hardhat import
import '@typechain/hardhat';
require('dotenv').config();
import './tasks/deploy-test-token'; // task

const config: HardhatUserConfig = {
  defaultNetwork: 'mumbai',
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: 'istanbul',
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: 'https://matic-mumbai.chainstacklabs.com	',
      gas: 2100000, // 2100000 'auto'
      gasPrice: 50000000000,
      accounts: [`${process.env.TEST_KEY_PVT}`],
    },
  },
};

export default config;
