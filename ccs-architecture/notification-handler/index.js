var net = require('net');
var dateFormat = require('dateformat');
var port = process.env.PORT || 3001;

console.log('.:Notification Handler Prototype:.');

var server = net.createServer(function (socket) {
	socket.on('data', function(data){
		var currentTimestamp=dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss l');
		console.log('[X] [%s] %s', currentTimestamp, data);
	}).on('end', function(){
		//console.log('Client terminated the connection with the Notification Handler.');
	});
}).listen(port);

console.log('Notification handler started listening on port ' + port);
