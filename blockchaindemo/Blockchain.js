const Block = require('./Block');
const SHA256 = require('crypto-js/sha256');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis];
    this.difficulty = 3;
  }

  get() {
    return this.chain;
  }

  get latestBlock() {
    return this.chain[this.chain.length - 1];
  }

  calculateHash(index, previousHash, timestamp, data, nonce) {
    return SHA256(index + previousHash + timestamp + data + nonce).toString();
  }

  isValidHashDifficulty(hash) {
    return hash.substring(0, this.difficulty) === "0".repeat(this.difficulty);
  }

  mine(data) {
    const lastBlock = this.latestBlock;
    let index = lastBlock.index + 1;
    let previousHash = lastBlock.hash;
    let timestamp;
    let hash;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      hash = this.calculateHash(index, previousHash, timestamp, data, nonce);
    } while (!this.isValidHashDifficulty(hash));

    const newBlock = new Block(index, previousHash, timestamp, data, hash, nonce);
    this.chain.push(newBlock);
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis)) return false;
    for (let i = 1; i < chain.length; i++) {
      const curr = chain[i];
      const prev = chain[i - 1];
      if (curr.previousHash !== prev.hash) return false;
      const calcH = this.calculateHash(curr.index, curr.previousHash, curr.timestamp, curr.data, curr.nonce);
      if (curr.hash !== calcH) return false;
      if (!this.isValidHashDifficulty(curr.hash)) return false;
    }
    return true;
  }

  isVaildNextBlock(newBlock, lastBlock) {
    if (newBlock.index !== lastBlock.index + 1) return false;
    if (newBlock.previousHash !== lastBlock.hash) return false;
    const calcH = this.calculateHash(newBlock.index, newBlock.previousHash, newBlock.timestamp, newBlock.data, newBlock.nonce);
    if (newBlock.hash !== calcH) return false;
    if (!this.isValidHashDifficulty(newBlock.hash)) return false;
    return true;
  }
}

module.exports = Blockchain;