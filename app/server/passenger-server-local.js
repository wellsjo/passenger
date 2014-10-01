var PeerServer = require('peer').PeerServer;

var server = new PeerServer({
	host: 'localhost',
	port: 9000,
	path: '/',
	key: '1234',
	allow_discovery: true
});

server.on('connection', function () {
	console.log(arguments);
});

server.on('disconnect', function () {
	console.log(arguments);
});