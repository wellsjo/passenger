document.querySelector('#go').onclick = function() {
    passenger.user.id = document.querySelector('#user_input_id').value;
    passenger.peer.connection.server_secret = document.querySelector('#user_input_server_key').value;
    passenger.makePeer();
};
