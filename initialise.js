//Importing the modules
const pg = require('pg');
const Sequelize = require('sequelize');
const Web3 = require('web3');
const settings = require('./settings.js');

//setting up the connection
const connection = new Sequelize(settings.database.db, settings.database.user, settings.database.password,{
    host: 'localhost',
    dialect:'postgres'
  });

//checking for the node type and returning the instance of web3.js
function setupNodeSession(node_type, host='localhost', port=8545, api_token='')  {
    let push_trace = 0;
    if(node_type == 'Parity'){
        node = new Web3(new Web3.providers.HttpPgrovider(`http://${host}:${port}`));
    }
    else if(node_type == 'Geth'){
        node = new Web3(new Web3.providers.HttpProvider(`http://${host}:${port}`));
    }
    else if(node_type == 'Infura'){
        node = new Web3( new Web3.providers.HttpProvider(`https://${host}/${api_token}`));
    }
    else{
        console.log('Node not supported');
    }
    if(node.isConnected()){
        console.log('Connected to node');
    }
    else{
        console.log('Unable to connect')
    }
    return [node,push_trace];
}
module.exports = {setupNodeSession,connection};
