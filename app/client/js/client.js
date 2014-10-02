document.querySelector('#go').onclick = function() {

    var peer = passenger.makePeer();
    console.log(peer.connections);

    peer.on('connection', function(dataConnection) {
        console.log('connection:');
        console.log(dataConnection);
    });

    peer.on('open', function(id) {
        console.log('Peer ID: ' + id);

        // TODO make the get url part of the config after
        // configuring the web server
        $.get(p.connections.http_server + '/connections', function(connections) {
            console.log('peer connections: ' + connections);
            var peer_connections = [];
            for(i in connections) {
                console.log('connecting to ' + connections[i]);
                peer_connections.push(peer.connect(connections[i]));
            }
            // note: it seems like you can connect to yourself lol
            console.log(peer_connections);
        });
    });

};
