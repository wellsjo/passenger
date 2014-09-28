var id = '1';

var peer = new Peer(id, {
	debug: 3,
	host: 'localhost',
	port: 9000,
	key: '1234',
	path: '/'
});

// var conn = peer.connect('2');

// conn.on('open', function () {
// 	console.log('connection opened');
// });
peer.on('connection', function (conn) {

	document.querySelector('#send_message').onclick = function () {
		var message = document.querySelector('#message').value;
		conn.send(message);
	};

	conn.on('data', function (data) {
		console.log('receiving data:');
		console.log(data);
	});
});