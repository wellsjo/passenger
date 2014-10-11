(function (window, $, Peer, _old, undefined) {
    "use strict";

    /**
     *
     * Initialization
     *
     */

    // Default config options
    var DEFAULTS = {

        // environment = local | remote
        // Note: this value is changed by devify.sh
        env: "local",

        debug: true,
        debug_level: 2,

        local: {
            peer_host: 'localhost',
            peer_port: 9000,
            peer_path: '/',
        },

        remote: {
            peer_host: '54.164.53.196', // aws instance (staging)
            peer_port: 9000,
            peer_path: '/',
        },

    },

    _singleton;

    // Constructor allows for one passenger initialization using singleton pattern
    // sets up connections and creates user object
    function Passenger(options) {
        if (!_singleton) {
            this.config = $.extend(true, {}, DEFAULTS, options); // overrides config defaults
            this.setupConnections();
            this.user = {};
            _singleton = this;
        }
        return _singleton;
    }

    // shortcut for proto
	Passenger.fn = Passenger.prototype;

	// sets the old value of Passenger on the window and returns itself
	Passenger.fn.noConflict = function () {
		window.Passenger = _old;
		return Passenger;
	};

    /**
     *
     * Passenger prototype
     *
     */

    var _dataCallbacks = [], // hold callback functions for receiving data
    _connectionCallbacks = [], // same, but for incoming connections
    _peer; // the peerjs object

	// accepts a hash of options and overwrites the default configs
	// or the existing connections object on the instance
	Passenger.fn.setupConnections = function (options) {
		this.connections = $.extend(true, this.connections || {
			peer: {
				debug: this.config.debug ? this.config.debug_level : 0,
				host: this.config[this.config.env].peer_host,
				port: this.config[this.config.env].peer_port,
				path: this.config[this.config.env].peer_path
			},

			httpServer: [
				this.config[this.config.env].http_host,
				this.config[this.config.env].http_port
			].join(':')

		}, options);
	};

    // inistantiates an new Peer object with the given options and
    // establishes 'connection' and 'data' callback functions
    Passenger.fn.initializePeer = function (options, callback) {
        var config = $.extend(true, {}, this.connections.peer, options),
        that = this;

        _peer = new Peer(config);

        // when you connect to the peerjs server
        _peer.on('open', function (id) {
            that.setUserInfo('peer_id', id);
            if (typeof callback === 'function') callback();
        });

        // when receiving incoming connection from another peer
        _peer.on('connection', function (conn) {

            // setup onData callbacks for this connection
            conn.on('data', function (data) { that.dataCallbacks(data, conn) });

            // trigger onConnection callbacks
            for (var i = 0, fn; fn = _connectionCallbacks[i++]; fn(conn));

            // log errors in debug
            conn.on('error', function(error) {
                if (that.config.debug) console.log(error);
            });
        });
    };

    // connect to a peer given its id
    Passenger.fn.connectToPeer = function (peerId, callback) {
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

        // log errors in debug
        conn.on('error', function(error) {
            if (that.config.debug) console.log(error);
        });

        if (typeof callback === 'function') callback();
    };

    // sequentially connect to each peer in the network
    Passenger.fn.connectToPeers = function (callback) {
        var that = this;

        _peer.listAllPeers(function (peers) {
            var connections = _peer.connections;

            for (var keys = Object.keys(peers), key; key = keys.pop();) {
                // ignore connecting to yourself as well as previously established connections
                if (peers[key] !== that.getUserInfo('peer_id') && !connections[peers[key]]) {
                    that.connectToPeer(peers[key]);
                }
            };
            if (typeof callback === 'function') callback();
        });
    };

    // send a direct message to one connection
    Passenger.fn.sendToPeer = function (peerId, data) {
        _peer.connections[peerId][0].send(data);
    };

    // send a message to all peers
    Passenger.fn.sendToAll = function (data) {
        var connections = _peer.connections;
        for (var keys = Object.keys(connections), key; key = keys.pop();) {
            connections[key][0].send(data);
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

	window.Passenger = Passenger;

})(this, this.jQuery, this.Peer, this.Passenger);
