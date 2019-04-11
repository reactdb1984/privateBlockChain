/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require("crypto-js/sha256");
const level = require("level");

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = level("./chaindata");
    this.chain.put(0,JSON.stringify(new Block("data")))
  }

getBlockHeight(){
  return new Promise((resolve, reject)  => {
  let i=0;
    chain.createReadStream()
    .on('data',  (data) => {
        i++;
    })
    .on('error',  (err) => {
        reject(err)
    })
    .on('close',  () => {
        resolve(i);
    });
});
}



  // Add new block
 async addBlock(newBlock) {

    // Block height
    newBlock.height = await this.getBlockHeight();
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
   
    newBlock.previousBlockHash = await this.getBlock( await this.getBlockHeight() -1).hash;
    
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
   await	this.chain.put(newBlock.height, JSON.stringify(newBlock).toString()
    );
  }




  // Get block 



    // get block
    getBlock(blockHeight){
      // return object as a single string
      return new Promise((resolve, reject) => {
        this.chain.get(blockHeight, function(err, value) {
            if (err) return console.log('Not found!', err);
            resolve(value);
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



// (function theLoop (i) {
//   setTimeout( () => {
//       let blockTest = new Block("Test Block - " + (i + 1));
//       new Blockchain().addBlock(new Block(`Test data ${i}`)).then((result) => {
//           console.log(result);
//           i++;
//           if (i < 10) theLoop(i);
//       },
//       },),
//   }, 10000);
// })(0);

// (function theLoop (i) {
//   setTimeout(function () {
//       let blockTest = new Block("Test Block - " + (i + 1));
//      new Blockchain.addBlock(blockTest).then((result) => {
//           console.log(result);
//           i++;
//           if (i < 10) theLoop(i);
//       });
//   }, 10000);
// })(0);


(function theLoop (i) {
  setTimeout(function () {
      let blockTest = new Block("Test Block - " + (i + 1));
      Blockchain.addBlock(blockTest).then((result) => {
          console.log(result);
          i++;
          if (i < 10) theLoop(i);
      });
  }, 10000);
})(0);