$(function () {
    'use strict';

    var client = new Passenger(),
    $input = $('#input'),
    $username = $('#username'),
    output = document.querySelector('#output');

    client.onJoin = function() {
        output.innerHTML += [
            '<strong>Welcome, ',
            client.getUserInfo('username'),
            '!</strong><br/>'
        ].join('');
    };

    // welcome users when someone connects
    client.onConnection(function(conn) {
        output.innerHTML += [
            '<strong>',
            conn.metadata.username,
            ' joined the chatroom!</strong><br/>'
        ].join('');
    });

    // show the message when data is received
    client.onData(function(data, conn) {
        output.innerHTML += [
            '<strong>',
            conn.metadata.username,
            ': </strong>',
            data,
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
                data,
                '<br/>'
            ].join('');
            $input.val('');
        }
    });

    // enter a username - TODO make it so you can change it
    $username.on('keydown', function (e) {
        if (e.which !== 13) return; // enter
        client.setUserInfo('username', $username.val());
        client.initializePeer();
        client.connectToPeers();
        $input.focus()
    });

});
