var id = '1';

var peer = new Peer(id, {
    debug: 3,
    host: 'localhost',
    port: 9000,
    key: '1234',
    path: '/'
});

var conn = peer.connect('2');

conn.on('open', function(){
    conn.send('hi client 2!');
});

peer.on('connection', function(conn) {
    console.log('receiving data:');
    console.log(data);
});
