passenger.makePeer = function() {
    return new Peer(passenger.user.id, p.connections.peer);
};
