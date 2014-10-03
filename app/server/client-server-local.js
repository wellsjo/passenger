// This is used to serve the local html/js client files
// and allows for cross-domain requests (unlike file://* urls)

var express = require('express'),
    http_server = express(),
    path = require('path');

http_server.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/html/client.html'));
});

http_server.get('/config.js', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../config.js'));
});

http_server.get('/:type/:name', function(req, res) {
    var file_type = req.params.type;
    var file_name = req.params.name;
    res.sendFile(path.resolve(__dirname + '/../client/' + file_type + '/' + file_name));
});

http_server.listen(5000);

console.log('Local web server running on port 5000')
