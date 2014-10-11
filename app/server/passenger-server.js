/**
 * passenger-server-remote.js
 * remote peer server for passegner
 */

var PeerServer = require('peer').PeerServer;

var settings = require('../../config.json');

var host = settings.peer_server[settings.env].host;
var port = settings.peer_server[settings.env].port;
var path = settings.peer_server[settings.env].path;

var server = new PeerServer({
    host: host,
    port: port,
    path: path,
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
