// passenger | p
passenger = {}, p = passenger;

// passenger config
p.config = {

    env: 'local',  // environment = local | remote

    debug: true,

    local: {
        peer_host: 'localhost',
        peer_port: 9000,
        peer_path: '/',

        http_host: 'http://localhost',
        http_port: 3000
    },

    remote: {
        host: '54.164.53.196',  // aws instance (staging)
        port: 9000,
        path: '/',

        http_host: null, // figure this out later
        http_port: null
    },

};

// store stuff about the user
p.user = {

};

p.connections = {
    peer: {
        debug: (function(){ return p.config.debug ? 3 : 0 }()),  // 0 | 3 depending on p.config.debug
        host: passenger.config[passenger.config.env].peer_host,
        port: passenger.config[passenger.config.env].peer_port,
        path: passenger.config[passenger.config.env].peer_path
    },

    http_server: passenger.config[passenger.config.env].http_host + ':'
        + passenger.config[passenger.config.env].http_port
};
