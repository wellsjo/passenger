var id = '1';

var peer = new Peer(id, {
	debug: 3,
	host: 'localhost',
	port: 9000,
	key: '1234',
	path: '/'
});

peer.on('connection', function (conn) {
	var input = document.querySelector('#message'),
		output = document.querySelector('#output');

	input.addEventListener('keydown', function (e) {
		if (e.which === 13) {
			conn.send(input.value);
			input.value = null;
		}
	});

	conn.on('data', function (data) {
		output.innerHTML += [data, '<br/>'].join('');
	});
});