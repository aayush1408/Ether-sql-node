const Web3 = require('web3');
const sequelize = require('sequelize');
const settings = require('./settings');
const setupNodeSession = require('./initialise').setupNodeSession;
const connection = require('./initialise').connection;
const Block = require('./models/blocks');
var kue = require('kue-unique');

const returnedValues = setupNodeSession(settings.node.type,settings.node.host,settings.node.port,settings.node.api_token);
let node_session = returnedValues[0];
let push_trace = returnedValues[1];


function addBlockNumber(block_number){
    
    let block_data = node_session.eth.getBlock(block_number);
    let block_timestamp = block_data.timestamp;
    let block_iso_timestamp = new Date(block_timestamp).toISOString();
    block_data.timestamp = block_iso_timestamp;
    
    Block.create({
        block_number :block_data.number,
        block_hash:block_data.hash,
        parent_hash:block_data.parentHash,
        difficulty:block_data.difficulty,
        gas_used:block_data.gasUsed,
        miner:block_data.miner,
        timestamp:block_data.timestamp,
        sha3uncles:block_data.sha3Uncles,
        extra_data:block_data.extraData,
        gas_limit:block_data.gasLimit,
        uncle_count:block_data.uncles.length,
        transaction_count:block_data.transactions.length,
    }).then((result)=>{
        console.log(result.dataValues);
    });

}
//dummy function call
addBlockNumber(7663682);