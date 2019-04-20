/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require("crypto-js/sha256");
const level = require("level");

/* ===== Block Class ==============================
|  Class with a constructor for block          |
|  ===============================================*/

class Block{
  constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
    static createGensisBlock() {
    
     let genblock =  new this("Genesis block").hash = SHA256(JSON.stringify(new this("Genesis block"))).toString();
   console.log("this is the genisis block")

      return genblock; 
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain    |
|  ================================================*/

class Blockchain{
  constructor(){
    
    this.chain = level("./chaindata");

    this.chain.put(0,JSON.stringify(Block.createGensisBlock()))
  } 
  

  getBlockHeight(){
    return new Promise((resolve, reject)  => {
    let count=0;
      this.chain.createReadStream().on('data',  (data) => {
          count++;
      }).on('error',  (err) => {
          reject(err)
      })
      .on('close',  () => {
          resolve(count);
      });
  });
  }


async addBlock(newBlock){

  let createdBlock = await this.createBlock(newBlock)
      this.chain.put(createdBlock.height,JSON.stringify(createdBlock))
      return createdBlock;
  }
  // Add new block
 async createBlock(newBlock) {

  let blockHeight = await this.getBlockHeight();
     let lastBlock = await this.getBlock(blockHeight-1)

         newBlock.height = blockHeight;

         newBlock.time = new Date().getTime().toString().slice(0,-3);

         newBlock.previousBlockHash = lastBlock.hash;
         
         newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    return newBlock 
    
  }

    // get block
    getBlock(blockHeight){
      // return object as a single string
      return new Promise((resolve, reject) => {
        this.chain.get(blockHeight, function(err, value) {
            if (err) return console.log('Not found!', err);
            resolve(JSON.parse(value));
        });
    })
    }
    // validate block
   async validateBlock(blockHeight){
      // get block object
      let block = this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain





    async validateChain(){
      let errorLog = [];
      let lengthChain = await this.getBlockHeight();
      for (var i = 0; i < lengthChain-1; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = await this.getBlock[i].hash;
        let previousHash = await this.getBlock[i+1].previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}



const myBlockchain = new Blockchain();

(function theLoop (i) {
 setTimeout(function () {

     let blockTest = new Block("Test Block -"  + (i + 1));
     myBlockchain.addBlock(blockTest).then((result) => {
         console.log(result);
         i++;
         if (i < 10) theLoop(i);
     });
 }, 10000);
})(0);
