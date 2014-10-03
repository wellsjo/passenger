/**
 * passenger-server-local.js
 * local settings for peerjs server
 */
var PeerServer = require('peer').PeerServer,
	express = require('express'),
	http_server = express();

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

/**
 * HTTP server endpoints
 */
http_server.all('/connections', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

http_server.get('/connections', function (req, res) {
	res.send(connections);
});

http_server.listen(3000, function () {
	console.log('Node HTTP server listening on port 3000');
});