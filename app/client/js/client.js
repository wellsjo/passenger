$(function () {
	"use strict";

	function escapeHtml(str) {
		var div = document.createElement('div');

		div.appendChild(document.createTextNode(str));
		return div.innerHTML;
	}

	var client = new Passenger(),
		$input = $('#input'),
		$username = $('#username'),
		output = document.querySelector('#output');

	client.initializePeer();

	client.onData(function (data, conn) {
		output.innerHTML += [
			"<strong>",
			conn.metadata.username,
			": </strong>",
			escapeHtml(data),
			'<br />'
		].join('');
	});

	$input.on('keydown', function (e) {
		var data = $input.val();

		// if 'enter' is pressed
		if (e.which === 13) {
			client.sendToAll(data);
			output.innerHTML += [
				"<strong>",
				$username.val(),
				": </strong>",
				escapeHtml(data),
				'<br />'
			].join('');
			$input.val('');
		}
	});

	// TODO: WCvD
	// Refactor to allow changing username
	$username.on('keydown', function (e) {
		// if 'enter' is pressed
		if (e.which === 13) {
			client.setUserInfo({
				username: $username.val()
			});
			client.connectToAll();
		}
	});

});