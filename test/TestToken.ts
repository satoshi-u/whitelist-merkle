import { MerkleTree } from 'merkletreejs';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import TestToken from '../artifacts/contracts/TestToken.sol/TestToken.json';
import keccak256 from 'keccak256';

// contract deployed @0x5C2a4fdC862609e0ba57F7a7FeA4632132299CF6
describe('Merkle Whitelisting', async function () {
  const TestTokenAddr = '0x5C2a4fdC862609e0ba57F7a7FeA4632132299CF6';
  const TestTokenInstance = await ethers.getContractAt(
    TestToken.abi,
    TestTokenAddr
  );
  const user1 = {
    address: '0x7AA366aa7b34F53893b339919D8F1bbaA9201d5B',
    quantity: 1,
  };
  const user2 = {
    address: '0x5D7E7B133E5f16C75A18e3b04Ac9Af85451C209c',
    quantity: 2,
  };
  const user3 = {
    address: '0x00934685C430777b911940d160B9aa00e6590eAe',
    quantity: 3,
  };
  let tree: MerkleTree;
  let proofs: string[][];

  describe('Deployment', function () {
    it('should return correct name and symbol - contract is deployed on testnet', async function () {
      expect(await TestTokenInstance.name()).to.equal('TestToken');
      expect(await TestTokenInstance.symbol()).to.equal('TTK');
    });
  });

  describe('Whitelisting', function () {
    it('should create a merkle tree for input data & store in memory', async function () {
      // inputs: array of users' addresses and quantity
      const inputs = [
        {
          address: user1.address, // bharat-nft-test
          quantity: user1.quantity,
        },
        {
          address: user2.address, // Dev
          quantity: user2.quantity,
        },
        {
          address: user3.address, // Test
          quantity: user3.quantity,
        },
      ];
      // create leaves from users' address and quantity
      const leaves = inputs.map((leaf) =>
        ethers.utils.solidityKeccak256(
          ['address', 'uint256'],
          [leaf.address, leaf.quantity]
        )
      );
      // create a Merkle tree
      tree = new MerkleTree(leaves, keccak256, { sort: true });
      // create Merkle proofs
      proofs = leaves.map((leaf) => tree.getHexProof(leaf));
    });
    it('should set merkle root in contract', async function () {
      const root = tree.getHexRoot();
      console.log('root: ', root);
      await TestTokenInstance.setMerkleRoot(root);
      console.log('merkle root set!');
    });
  });

  describe('Minting', function () {
    it('should allow whitelisted users to mint correct quantity', async function () {
      let user1PrevBalance = await TestTokenInstance.balanceOf(
        user1.address
      );
      console.log('user1PrevBalance: ', user1PrevBalance);
      // console.log('proofs[0]: ', proofs[0]);
      const resp = await TestTokenInstance.safeMint(
        user1.address,
        user1.quantity,
        proofs[0]
      );
      const txReceipt = await resp.wait(2); // waiting for 2 blocks
      if (txReceipt.status === 1) {
        const user1CurrBalance = await TestTokenInstance.balanceOf(
          user1.address
        );
        console.log(
          'user1CurrBalance (after safeMint): ',
          user1CurrBalance
        );
        expect(user1CurrBalance).to.equal(
          Number(user1PrevBalance) + user1.quantity
        );
      }
    });

    it('should revert when users try to mint over allowed quantity', async function () {
      try {
        await TestTokenInstance.safeMint(
          user2.address,
          user2.quantity + 1,
          proofs[1]
        );
      } catch (error: any) {
        expect(error.message).to.contains('invalid proof');
      }
    });

    it('should revert when non-whitelisted users try to mint', async function () {
      try {
        await TestTokenInstance.safeMint(
          '0xd80abbdb6ca00623fb731f72b2a0ee79c6622ff1', // non-whitelisted user
          1,
          proofs[0]
        );
      } catch (error: any) {
        expect(error.message).to.contains('invalid proof');
      }
    });
  });
});
