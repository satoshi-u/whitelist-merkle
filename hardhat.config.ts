import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades'; // this allows to get {upgrades, ethers} from hardhat import
import '@typechain/hardhat';
require('dotenv').config();
import './tasks/deploy-test-token'; // task
import './tasks/create-test-whitelist'; // task

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
      // accounts: {
      //   mnemonic:
      //     'combine chat tragic smile recipe chicken clay tongue team patch shiver bone',
      //   path: "m/44'/60'/0'/0/0",
      //   initialIndex: 0,
      //   count: 1,
      //   passphrase: '',
      // },
      accounts: [`${process.env.BHARAT_NFT_TEST_KEY_PVT}`],
      // from: '0x7AA366aa7b34F53893b339919D8F1bbaA9201d5B',
      // `${process.env.BHARAT_NFT_TEST_KEY_PVT}`]
      // pvt 0xf4c48a8deeb0ddc806e3b50689af35f62f49970a5f1f4124a2d1e2db89421574
      // pub 0x045eebbbbcc5dccd709a8b34b72bec33d24aa840561421db836c94be03d05c2388951a69fd931af7678d22da031ef22d70c88f9c5c0221a817d1c320d23fc1e87f
      // address 0x7AA366aa7b34F53893b339919D8F1bbaA9201d5B
      // httpHeaders: {
      //   'x-auth-token':
      //     'bpaas-6e4B6626A413c2e89cEec90E77C6E1f4Ab251968',
      //   //`${process.env.BNFT_TEST_MASTER_API_KEY}`
      // },
    },
  },
};

export default config;
