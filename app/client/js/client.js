$(function () {
    'use strict';

    var client = new Passenger(),
    $input = $('#input'),
    $username = $('#username'),
    output = document.querySelector('#output');

    // fired when you join a peer network
    client.onJoin = function() {
        output.innerHTML += [
            '<strong>Welcome, ',
            client.getUserInfo('username'),
            '!</strong><br/>'
        ].join('');
    };

    // fired when someone connects
    client.onConnection(function(conn) {
        output.innerHTML += [
            '<strong>',
            conn.metadata.username,
            ' joined the chatroom!</strong><br/>'
        ].join('');
    });

    // fired when data is received from peer
    client.onData(function(data, conn) {
        output.innerHTML += [
            '<strong>',
            data.username,
            ': </strong>',
            data.message,
            '<br/>'
        ].join('');
    });

    // type into the message box
    $input.on('keydown', function (e) {
        if (e.which !== 13) return; // enter

        var data = {
            username: client.getUserInfo('username'),
            message: $input.val()
        };

        client.sendToAll(data);
        output.innerHTML += [
            '<strong>',
            client.getUserInfo('username'),
            ': </strong>',
            data.message,
            '<br/>'
        ].join('');
        $input.val('');
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
