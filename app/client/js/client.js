$(function () {
    'use strict';

    var client = new Passenger(),
    $input = $('#input'),
    $username = $('#username'),
    output = document.querySelector('#output');

    // show the message when data is received
    client.onData(function(data, conn) {
        output.innerHTML += [
            '<strong>',
            conn.metadata.username,
            ': </strong>',
            escapeHtml(data),
            '<br/>'
        ].join('');
    });

    // type into the message box
    $input.on('keydown', function (e) {
        var data = $input.val();

        if (e.which === 13) { // enter
            client.sendToAll(data);
            output.innerHTML += [
                '<strong>',
                $username.val(),
                ': </strong>',
                escapeHtml(data),
                '<br />'
            ].join('');
            $input.val('');
        }
    });

    // enter a username - TODO make it so you can change it
    $username.on('keydown', function (e) {
        if (e.which !== 13) return; // enter
        client.setUserProperty('username', $username.val());
        client.initializePeer();
        client.connectToPeers();
        $input.focus()
    });

    // easy html formatting
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
});
