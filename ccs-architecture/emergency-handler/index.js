var net = require('net');
var dateFormat = require('dateformat');
var port = process.env.PORT || 3000;
var notificationHandlerPort = process.env.NOTIFICATION_HANDLER_PORT || 3001;
var notificationHandlerHost = process.env.NOTIFICATION_HANDLER_HOST || 'localhost';

console.log('.:Emergency Handler Prototype:.');
console.log('Connection with Notification Handler is configured via TCP Socket on [%s:%s]', notificationHandlerHost, notificationHandlerPort);

var server = net.createServer(function (socket) {
	socket.on('data', function(data){
		var currentTimestamp=dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss l');
		console.log('[X] [%s] %s', currentTimestamp, data);
		
		var notificationSocket = net.createConnection(notificationHandlerPort, notificationHandlerHost);
		var messageTokens = data.toString().split('|');
		notificationSocket.write('sendNotification|' + messageTokens[1] + '|' + messageTokens[2]);
		notificationSocket.end();
	}).on('end', function(){
		//console.log('Client terminated the connection with the Emergency Handler.');
	});
}).listen(port);

console.log('Emergency handler started listening on port ' + port);