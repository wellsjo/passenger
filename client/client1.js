var id = '1';

var peer = new Peer(id, {
    debug: 3,
    host: '172.30.0.62',
    port: 9000,
    key: '1234',
    path: '/passenger'
});

var conn = peer.connect('2');
conn.on('open', function(){
  conn.send('hi!');
});

peer.on('connection', function(conn) {
  conn.on('data', function(data){
    console.log(data);
  });
});
