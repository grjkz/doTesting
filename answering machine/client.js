var net = require('net');
var client = net.Socket();

client.connect({port:3000,host:"localhost"},function() {
	console.log("Connected...");
	// client.write("user connected");

	process.stdin.on('data',function(input){
		client.write(input.toString().trim());
	})

	client.on('data',function(data) {
		console.log(data.toString().trim());
	})




	client.on('end',function() {
		console.log("Disconnected");
	})
})

