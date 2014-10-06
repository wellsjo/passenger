(function (window, $, Peer, Passenger, undefined) {
    "use strict";

    var _dataCallbacks = [], // hold callback functions for receiving data
    _connectionCallbacks = [], // same, but for incoming connections
    _peer; // the peerjs object

    // inistantiates an new Peer object with the given options and
    // establishes 'connection' and 'data' callback functions
    Passenger.fn.initializePeer = function (options) {
        var config = $.extend(true, {}, this.connections.peer, options),
        that = this;

        _peer = new Peer(config);

        // when you connect to the peerjs server
        _peer.on('open', function (id) {
            that.setUserInfo('peer_id', id);
            that.onJoin(); // trigger onConnection events
        });

        // when receiving incoming connection from another peer
        _peer.on('connection', function (conn) {

            // setup onData callbacks for this connection
            conn.on('data', function (data) { that.dataCallbacks(data, conn) });

            // trigger connection callbacks
            for (var i = 0, fn; fn = _connectionCallbacks[i++]; fn(conn));

            conn.on('error', function(error) { console.log(error); });
        });
    };

    // connect to a peer given its id
    Passenger.fn.connectToPeer = function (peerId) {
        var conn, that = this;

        conn = _peer.connect(peerId, {
            // metadata is only passed by the person initiating the connection.
            // therefore, we only use this to see who has entered the room.
            // it is not used to persist any data.
            metadata: {
                username: this.getUserInfo('username')
            }
        });

        // setup data callbacks for this connection
        conn.on('data', function (data) { that.dataCallbacks(data, conn); });

        conn.on('error', function(error) { console.log(error); });
    };

    // sequentially connect to each peer in the network
    Passenger.fn.connectToPeers = function () {
        var that = this;

        _peer.listAllPeers(function (peers) {
            var connections = _peer.connections;

            for (var x in peers) {
                // ignore connecting to yourself as well as previously established connections
                if (peers[x] !== that.getUserInfo('peer_id') && !connections[peers[x]]) {
                    that.connectToPeer(peers[x]);
                }
            }
        });
    };

    // send a direct message to one connection
    Passenger.fn.sendToPeer = function (peerId, data) {
        for (var i in _peer.connections[peerId]) {
            _peer.connections[peerId][i].send(data);
        }
    };

    // send a message to all peers
    Passenger.fn.sendToAll = function (data) {
        var connections = _peer.connections;
        for (var i in connections) {
            connections[i][0].send(data);
        }
    };

    // set a user property: setUserInfo('peer_id', '2345');
    Passenger.fn.setUserInfo = function (property, value) {
        this.user[property] = value;
    };

    // get a property or all properties from the user (if no property provided)
    // getUserInfo() --> return user object
    // getUserInfo('peer_id') --> returns user.peer_id
    Passenger.fn.getUserInfo = function(property) {
        return !property ? this.user : this.user[property];
    };

    // allow for multiple callbacks when data is received
    Passenger.fn.onData = function(fn) {
        if ($.isFunction(fn)) {
            _dataCallbacks.push(fn);
        }
    };

    // same as above, but for connections
    Passenger.fn.onConnection = function(fn) {
        if ($.isFunction(fn)) {
            _connectionCallbacks.push(fn);
        }
    };

    // this is called whenever data is received.  since this can happen
    // in multiple contexts, this logic is consolidated here.
    Passenger.fn.dataCallbacks = function(data, conn) {
        for (var i = 0, fn; fn = _dataCallbacks[i++]; fn(data, conn));
    };

})(this, this.jQuery, this.Peer, this.Passenger);
