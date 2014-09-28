var id = '2';

var peer = new Peer(id, {
    debug: 3,
    host: 'localhost',
    port: 9000,
    key: '1234',
    path: '/'
});

var conn = peer.connect('1');
conn.on('open', function(){
    conn.send('hi client 1!');
});

peer.on('connection', function(conn) {
    conn.on('data', function(data){
        console.log('receiving data:');
        console.log(data);
    });
});

