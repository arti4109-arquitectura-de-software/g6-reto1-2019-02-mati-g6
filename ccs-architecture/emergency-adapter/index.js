var net = require('net');
var amqp = require('amqplib/callback_api');
var dateFormat = require('dateformat');
var emergencyHandlerPort = process.env.EMERGENCY_HANDLER_PORT || 3000;
var emergencyHandlerHost = process.env.EMERGENCY_HANDLER_HOST || 'localhost';
var rabbitMQHost = process.env.RABBIT_MQ_HOST || 'localhost';
var emergencySignalQueue = process.env.EMERGENCY_SIGNAL_QUEUE || 'VEHICLE.EMERGENCY.SIGNAL';

console.log('.:Emergency Adapter Prototype:.');
console.log('Connection with Emergency Handler is configured via TCP Socket on [%s:%s]' , emergencyHandlerHost , emergencyHandlerPort);

amqp.connect('amqp://' + rabbitMQHost, function(error0, connection) {
	
	if (error0) {
		throw error0;
	}
	
	connection.createChannel(function(error1, channel) {
		channel.consume(emergencySignalQueue, function(msg) {
			if(msg.content) {
				var socket = net.createConnection(emergencyHandlerPort, emergencyHandlerHost);
				var currentTimestamp=dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss l');
				console.log("[X] [%s] %s ", currentTimestamp, msg.content.toString());
				socket.write('handleEmergency|' + msg.content);
				socket.end();
			}
		}, {
			noAck: true
		});
		console.log('Consumer for ' + emergencySignalQueue + ' created.');
	});
	
});