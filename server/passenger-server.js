var PeerServer = require('peer').PeerServer;

var server = new PeerServer({
    host: 'localhost',
    port: 9000,
    path: '/',
    key: '1234'
});

server.on('connection', function(id) {
    console.log('lol');
});

server.on('disconnect', function() {
    console.log('disconnected');
});
