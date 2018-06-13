const Web3 = require('web3');
const sequelize = require('sequelize');
const settings = require('./settings');
const setupNodeSession = require('./initialise').setupNodeSession;
const connection = require('./initialise').connection;
const Block = require('./models/blocks');

const returnedValues = setupNodeSession(settings.node.type,settings.node.host,settings.node.port,settings.node.api_token);
let node_session = returnedValues[0];
let push_trace = returnedValues[1];
function processBlock(){
    let node_block_number = node_session.eth.blockNumber;
    connection.query(`SELECT MAX(block_number) FROM blocks`).then((result)=>{
        var sql_block_number = result[0][0].max;
        console.log(sql_block_number);
        if(node_block_number == sql_block_number){
            console.log('Nothing to be scraped');
        }
        else{
            console.log('Enter into the database');
        }
    });
}

setInterval(processBlock,1000);