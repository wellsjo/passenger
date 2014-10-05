/**
 * passenger-server-remote.js
 * remote peer server for passegner
 */

var PeerServer = require('peer').PeerServer;

var server = new PeerServer({
    host: '54.164.53.196',
    port: 9000,
    path: '/',
    allow_discovery: true
});

console.log('PeerServer listening on port 9000');

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
