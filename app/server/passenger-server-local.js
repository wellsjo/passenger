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
