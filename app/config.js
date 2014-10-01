// passenger | p
passenger = {}, p = passenger;

// passenger config
p.config = {

    env: 'local',  // environment = local | remote

    debug: false,

    local: {
        host: 'localhost',
        port: 9000,
        path: '/',
        server_secret: '1234' // default (input will override) *
    },

    remote: {
        host: '54.164.53.196',  // aws instance (staging)
        port: 9000,
        path: '/',
        server_secret: '1234' // *
    },

};

// store stuff about the user
p.user = {

};

// PeerJS settings
p.peer = {
    connection: {
        debug: (function(){ return p.config.debug ? 3 : 1 }()),  // 1 | 3 depending on p.config.debug
        host: passenger.config[passenger.config.env].host,
        port: passenger.config[passenger.config.env].port,
        server_secret: passenger.config[passenger.config.env].server_secret,
        path: passenger.config[passenger.config.env].path
    }
};
