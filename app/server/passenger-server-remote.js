/**
 * passenger-server-remote.js
 * remote peer server for passegner
 */

var PeerServer = require('peer').PeerServer;

var host = '54.164.53.196';
var port = 9000;

var server = new PeerServer({
    host: host,
    port: port,
    path: '/',
    allow_discovery: true
});

console.log('PeerServer listening on port ' + port);
console.log('Connect to: ' + host + ':' + port);

// basic connection management
var connections = [];

/**
 * PeerServer Events
 */
server.on('connection', function (id) {
	connections.push(id);
});

server.on('disconnect', function (id) {
	connections.splice(connections.indexOf(id), 1);
});
