/* Created queue */
var kue = require('kue-unique');
var newQueue = kue.createQueue();
module.exports = newQueue;