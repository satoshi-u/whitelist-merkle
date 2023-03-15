// import Debug from 'debug';
import { task } from 'hardhat/config';

// Merkle Root @ 0x7d29b5291757c791e5a86285f6d720a9bcb037e362ab62e68fb69d968549e812
export default task(
  'deploy-test-token',
  'Deploy a ERC721 Test Token to demonstrate merkle-whitelisting'
).setAction(async (args, hre) => {
  const testTokenFactory = await hre.ethers.getContractFactory(
    'TestToken'
  );
  const proxyContract = await hre.upgrades.deployProxy(
    testTokenFactory,
    ['TestToken', 'TTK'],
    {
      initializer: 'initialize',
      kind: 'uups',
    }
  );
  console.log(
    `deployed a new upgradable TestToken contract, proxy @ ${proxyContract.address}`
  );
});
