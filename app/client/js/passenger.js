(function (window, $, Peer, _old, undefined) {
	"use strict";

	// Default config options
	var DEFAULTS = {

			env: 'local', // environment = local | remote

			debug: false,

			local: {
				peer_host: 'localhost',
				peer_port: 9000,
				peer_path: '/',

				http_host: 'http://localhost',
				http_port: 3000
			},

			remote: {
				peer_host: '54.164.53.196', // aws instance (staging)
				peer_port: 9000,
				peer_path: '/',

				http_host: null, // figure this out later
				http_port: null
			},

		},
		_dataCallbacks = [], // hold callback functions for receiving data
        _connectionCallbacks = [], // same, but for incoming connections
		_peer, _singleton;

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

    // set a user property: setUserInfo('userid', '2345');
    Passenger.fn.setUserInfo = function (property, value) {
        this.user[property] = value;
    };

    // get a property or all properties from the user (if no property provided)
    // getUserInfo() --> return user object
    // getUserInfo('userid') --> returns user.userid
    Passenger.fn.getUserInfo = function(property) {
        return !property ? this.user : this.user[property];
    };

	// sets the old value of Passenger on the window and returns itself
	Passenger.fn.noConflict = function () {
		window.Passenger = _old;
		return Passenger;
	};

	// accepts a hash of options and overwrites the default configs
	// or the existing connections object on the instance
	Passenger.fn.setupConnections = function (options) {
		this.connections = $.extend(true, this.connections || {
			peer: {
				debug: this.config.debug ? 3 : 0,
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
	Passenger.fn.initializePeer = function (options) {
		var config = $.extend(true, {}, this.connections.peer, options),
            that = this;

		_peer = new Peer(config);

        // once connection is open
        _peer.on('open', function (id) {
            console.log('connection open. userid set to ' + id);
            that.setUserInfo('id', id);
            that.onJoin();
        });

		// attach handler for receiving connection from another peer
        _peer.on('connection', function (conn) {

            // for some reason if this isn't here, the username metadata doesn't carry over.
            // otherwise it isn't necessary. maybe this is a bug in peerjs code?
            that.connectToPeers();
            conn.on('data', function (data) { that.dataCallbacks(data, conn) });

            // call the stored connection callbacks
            for (var i = 0, fn; fn = _connectionCallbacks[i++]; fn(conn));
		});
	};


    // connect to a peer given its id
    Passenger.fn.connectToPeer = function (remoteId) {
        var conn, that = this;

        console.log('connecting to peer ' + remoteId);
        conn = _peer.connect(remoteId, {
            metadata: this.user
        });
        conn.on('data', function (data) { that.dataCallbacks(data, conn); });
        conn.on('error', function(error) { console.log(error); });
    };

    // called when a username is set.  automatically connect to all peers
    Passenger.fn.connectToPeers = function () {
        var that = this;

        // get all peer ids from server and iterate over them, connecting to each
        _peer.listAllPeers(function (peers) {
            var connections = _peer.connections;

            for (var x in peers) {
                // ignore connecting to yourself as well as previously established connections
                if (peers[x] !== that.getUserInfo('id') && !connections[peers[x]]) {
                    that.connectToPeer(peers[x]);
                }
            }
        });
    };

    // send a direct message to one connection
	Passenger.fn.sendToPeer = function (peer_id, data) {
        for (var i in _peer.connections[peer_id]) {
            _peer.connections[peer_id][i].send(data);
        }
	};

    // send a message to all peers
    Passenger.fn.sendToAll = function (data) {
        var connections = _peer.connections;

        for (var i in connections) {
            connections[i][0].send(data);
        }
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
