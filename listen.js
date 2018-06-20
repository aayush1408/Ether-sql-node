const Web3 = require('web3');
const sequelize = require('sequelize');

//imported settings
const settings = require('./settings');

//Acquired web3 instance and setup the connection to db
const setupNodeSession = require('./initialise').setupNodeSession;
const connection = require('./initialise').connection;

// Imported the models
const Block = require('./models/blocks');
const Transaction = require('./models/transactions');

// Imported the queue
const newQueue = require('./queue');

//getting the returned values from the setUpnodeSession function    
const returnedValues = setupNodeSession(settings.node.type,settings.node.host,settings.node.port,settings.node.api_token);
let node_session = returnedValues[0];
let push_trace = returnedValues[1];

//addBlockno gets the block data from the client using block number and stores into the db.
function addBlockNumber(block_number){
    console.log(block_number);

    //Getting the data of the block using block_number
    let block_data = node_session.eth.getBlock(parseInt(block_number));

    //Updating the timestamp as per our need
    let block_timestamp = block_data.timestamp;
    let d = new Date(0);
    d.setUTCSeconds(block_timestamp);
    if(d.getMonth()>10){
    var final_timestamp = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;        
    }
    else{
    var final_timestamp = `${d.getFullYear()}-0${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;  
    }

    //updating the timestamp in the block data object
    block_data.timestamp = final_timestamp;

    //Adding the block details into the table
    Block.create({
        block_number :block_data.number,
        block_hash:block_data.hash,
        parent_hash:block_data.parentHash,
        difficulty:block_data.difficulty.toString(),
        gas_used:block_data.gasUsed,
        miner:block_data.miner,
        timestamp:block_data.timestamp,
        sha3uncles:block_data.sha3Uncles,
        extra_data:block_data.extraData,
        gas_limit:block_data.gasLimit,
        uncle_count:block_data.uncles.length,
        transaction_count:block_data.transactions.length,
    }).then((result)=>{
        console.log('Inserting into block table');
    }).catch(()=>{
        console.log('Error in inserting blocks');
    })

    //Looping through the transaction array in the block data to get hash values
    for(transaction in block_data.transactions){

        //Getting the transaction information
        let transaction_data = node_session.eth.getTransaction(block_data.transactions[transaction]);

        //Adding the transaction into the table
        Transaction.create({
            transaction_hash:block_data.transactions[transaction],
            block_number:transaction_data.blockNumber,
            nonce:transaction_data.nonce,
            sender:transaction_data.from, 
            receiver:transaction_data.to,
            start_gas:transaction_data.gas,
            value:transaction_data.value.toString(),
            data:transaction_data.input,
            gas_price:transaction_data.gasPrice.toString(),
            timestamp:final_timestamp,
            transaction_index:transaction_data.transactionIndex,
        }).then((result)=>{
            console.log('Inserting into the transaction table');
        }).catch(()=>{
            console.log('Error into inserting transactions');
        });

    }
}

//gets the block_no from queue
//checks whether the no exists in db
//if not then add into db
module.exports = function getBlockByNumber(block_number){
    let start = Date.now();
    Block.findOne({ where: {block_number}})
    .then((result)=>{
      console.log(result.dataValues);
      let end = Date.now();
      let elasped = (end - start)/1000;
      console.log(`Time elapsed ${elasped} seconds`);
      }).catch((err)=>{
      console.log(`Entering block ${block_number} into db`);
      addBlockNumber(block_number);    
      });
}
