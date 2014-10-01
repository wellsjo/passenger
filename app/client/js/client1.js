var id = '1';

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
