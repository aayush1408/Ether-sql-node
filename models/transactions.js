const Sequelize = require('sequelize');

const settings = require('../settings');
const connection = new Sequelize(settings.database.db, settings.database.user, settings.database.password,{
    host: 'localhost',
    dialect:'postgres'
  });

 //Defining the schema and model of transaction
var Transaction = connection.define('transactions',{
    transaction_hash:Sequelize.STRING,
    block_number:Sequelize.NUMERIC,
    nonce:Sequelize.NUMERIC,
    sender:Sequelize.STRING,
    receiver:Sequelize.STRING,
    start_gas:Sequelize.NUMERIC,
    value:Sequelize.NUMERIC,
    data:Sequelize.STRING,
    gas_price:Sequelize.NUMERIC,
    timestamp:Sequelize.DATE,
    transaction_index:Sequelize.NUMERIC,
    },
    {
      timestamps:false
    });
    
    //Remove primary key
    Transaction.removeAttribute('id');
    
    module.exports = Transaction;