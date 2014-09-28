var PeerServer = require('peer').PeerServer;
var server = new PeerServer({port: 9000, path: '/passenger'});

server.on('connection', function(id) {
    console.log('lol');
});

server.on('disconnect', function() {
    console.log('disconnected');
});
