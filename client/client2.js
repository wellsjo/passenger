var id = '2';

document.querySelector('#send_message').onclick = function () {
	var message = document.querySelector('#message').value;
	conn.send(message);
};

var peer = new Peer(id, {
	debug: 3,
	host: 'localhost',
	port: 9000,
	key: '1234',
	path: '/'
});

var conn = peer.connect('1');

conn.on('open', function () {

	console.log('connection opened');

	conn.on('data', function (data) {
		console.log('receiving data:');
		console.log(data);
	});

});