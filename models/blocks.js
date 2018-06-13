const Sequelize = require('sequelize');

const settings = require('../settings');
const connection = new Sequelize(settings.database.db, settings.database.user, settings.database.password,{
    host: 'localhost',
    dialect:'postgres'
  });

  var Block = connection.define('blocks',{
    block_number:Sequelize.NUMERIC,
    block_hash:Sequelize.STRING,
    parent_hash:Sequelize.STRING,
    difficulty:Sequelize.NUMERIC,
    gas_used:Sequelize.NUMERIC,
    miner:Sequelize.NUMERIC,
    timestamp:Sequelize.DATE,
    sha3uncles:Sequelize.STRING,
    extra_data:Sequelize.STRING,
    gas_limit:Sequelize.NUMERIC,
    uncle_count:Sequelize.NUMERIC,
    transaction_count:Sequelize.NUMERIC,
    },
    {
      timestamps:false
      });
    
    //Remove primary key
    Block.removeAttribute('id');  
    module.exports = Block;