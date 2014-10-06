(function (window, $, Peer, _old, undefined) {

    // Default config options
    var DEFAULTS = {

        // environment = local | remote
        // Note: this value is changed by devify.sh
        env: "local",

        debug: true,
        debug_level: 2,

        // TODO just have these be overridden by devify in a local params file
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

	window.Passenger = Passenger;

})(this, this.jQuery, this.Peer, this.Passenger);
