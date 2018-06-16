//setting the limit of listeners
require('events').EventEmitter.prototype._maxListeners = 0;


//requiring the modules
const Web3 = require('web3');
const sequelize = require('sequelize');
const settings = require('./settings');


//getting the values from intialise file
const setupNodeSession = require('./initialise').setupNodeSession;
const connection = require('./initialise').connection;


//Getting the models
const Block = require('./models/blocks');

//Acquiring queue
const newQueue = require('./queue');
const getBlockByNumber  = require('./listen');

//getting the sql_block_number and creating jobs
function newBlock(block_number){
    var job = newQueue.create('new_job',{
        block_number
    });
    job.on( 'complete', function () {
    console.log("Job complete");
    }).on( 'failed', function () {
    console.log("Job failed");
    });
    job.save();
    console.log(job.data.block_number);
}

 

//getting the returned values from the setUpnodeSession function    
const returnedValues = setupNodeSession(settings.node.type,settings.node.host,settings.node.port,settings.node.api_token);
let node_session = returnedValues[0];
let push_trace = returnedValues[1];


//processBlock() runs every second and checks for the latest block number in node and  max sql node number
function processBlock(){
    let node_block_number = node_session.eth.blockNumber;
    console.log('fetched block no',node_block_number);
    connection.query(`SELECT MAX(block_number) FROM blocks`).then((result)=>{
        var sql_block_number = result[0][0].max;
        console.log(sql_block_number);
        if(node_block_number == sql_block_number){
            console.log('Nothing to be scraped');
        }
        else{
            for(let i=1;i<=5;i++){
                newBlock(parseInt(sql_block_number)+i);
            }
        }
    });        
}
 
//calling the processBlock every second
setInterval(processBlock,1000);

// //proceesing the jobs
newQueue.process('new_job',5, function (job, done){
    console.log('Processed');
    getBlockByNumber(job.data.block_number);
    done && done();
});    
