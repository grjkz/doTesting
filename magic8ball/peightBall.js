var chalk = require('chalk');
var net = require('net');
var port = 3000;
var users = [];
// var colors = ['blue','green','orange','yellow','purple','teal','red','gray']
var response = ["It is certain", "It is decidedly so", "Yes, definitely", "Most likely", "Yes", "Don't count on it", "Very doubtful", "Ask again later", "No", "Signs point to yes", "404 error", "Hell no", "I'm tired of answering your questions", "Google it", "You've got to be kidding", "That's a good question", "Thanks for asking", "I'm not sure", "No hablo ingles", "Potatos", "Hah", "I don't know"];

var server = net.createServer(function(c) {
	users.push(c)
	console.log(users.length+" users connected");
	process.stdin.on('data',function(input) {
		c.write(input);
	})

	c.write("Submit a question and I shall answer.\r\n");

	c.on('data',function(data) {
		data = data.toString().trim();
		data = data.toLowerCase();

		if (data.match(/\b\?$/)) {
			// var calur = colors[Math.floor(Math.random()*colors.length)];
			console.log(data);
			c.write(chalk.red(response[Math.floor(Math.random()*response.length)]+"\r\n"));
		}
		else {
			console.log("Didnt match regex");
			c.write("Please ask a question\r\n");
		}


	})

	c.on('end',function() {
		var index = users.indexOf(this);
		users.splice(index,1);
		console.log(users.length+" users connected");
	})

})

server.listen(port, function() {
	console.log("listening...")
})