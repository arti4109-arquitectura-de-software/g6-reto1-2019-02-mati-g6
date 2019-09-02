var net = require('net');
var amqp = require('amqplib/callback_api');
var uuidv1 = require('uuid/v1');
var emergencyHandlerPort = process.env.EMERGENCY_HANDLER_PORT || 3000;
var emergencyHandlerHost = process.env.EMERGENCY_HANDLER_HOST || 'localhost';
var rabbitMQHost = process.env.RABBIT_MQ_HOST || 'localhost';
var emergencyExchange = process.env.EMERGENCY_EXCHANGE || 'VEHICLE.EMERGENCY';
var emergencySignalRK = process.env.EMERGENCY_SIGNAL_RK || 'EMGNCY.SGNL';

console.log('.:Vehicle Simulator:.');

amqp.connect('amqp://' + rabbitMQHost, function(error0, connection) {
	
	if (error0) {
		throw error0;
	}
	
	connection.createChannel(function(error1, channel) {
		
		console.log('Publishing 50 messages to [%s] with Routing Key [%s] each 1 seconds', emergencyExchange, emergencySignalRK);
		
		var timeBefore = new Date().getTime(), testTime = 5;
		
		var interval = setInterval(function(){
			for (i = 0; i < 50; i++) {
				var message = uuidv1() + '|Emergency Report';
				channel.publish(emergencyExchange, emergencySignalRK, Buffer.from(message));
				console.log('[X] [%s]', message);
			}
			
			var currentTime = new Date().getTime();
			var currentDifference = currentTime - timeBefore;
			if (currentDifference >= (testTime * 60 * 1000) ) {
				clearInterval(interval);
				console.log('Test complete in %s miliseconds.', currentDifference);
				
				setTimeout(function(){
					channel.close();
					connection.close();
				}, 500);
			}
		}, 1000);
		
	});
	
});