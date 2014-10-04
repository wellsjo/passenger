/**
 * passenger-server-local.js
 * local settings for peerjs server
 */
var PeerServer = require('peer').PeerServer;

// TODO have these settings imported from config.js
var server = new PeerServer({
	host: 'localhost',
	port: 9000,
	path: '/',
	allow_discovery: true
});

console.log('PeerServer listening on port 9000');

// unnecessary, but used for demonstrating the /connections endpoint
// I'm not sure how we're going to use the REST server yet
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
