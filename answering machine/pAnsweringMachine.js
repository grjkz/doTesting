var net = require('net');
var port = 3000;
var fs = require('fs');
var logged = false;

var server = net.createServer(function(c) {
	console.log("a user has connected");
	c.write("Enter your username and password before you begin\r\n");
	

// just to enable sending messages to client from server
	process.stdin.on('data',function(input) {
		c.write(input);
	})

		c.on('data',function(data) {
			var data = data.toString().trim().split(" "); // turns the entire client input into an array

			/////// CHECK USERNAME AND PASSWORD
			if (logged) {

				////////adding a new message. ex: add i'm leaving you a message
				if (data[0] === 'add') {
					if (data.length > 2) {
						data.shift();
						data = data.join(" ");
						add(data);
						c.write("Message has been saved\r\n");
					}
					else {
						c.write("You can't leave an empty message\r\n");
					}
				}

				if (data[0] === 'del') {
					var messages = JSON.parse(fs.readFileSync('messages.json','utf8'));
					// console.log(messages); 
					// YOU CANNOT C.WRITE AN OBJECT TO A CLIENT!!!
					if (messages.msg[data[1]]) {
						var deleted = messages.msg.splice(data[1],1); //deletes the nth message specified by 2nd argument
						fs.writeFileSync('messages.json',JSON.stringify(messages));
						c.write("Message "+data[1]+": "+deleted);
						c.write("^ This is the last time you'll see that message ^")
						c.write(messages.msg.length+" messages remain");
					}
					else {
						c.write("Please check your input again. ex. del 0");
						c.write("You have "+messages.msg.length+" messages");
					}
				}
				
				if (data[0] === 'delAll') {
					delAll(data,c);
				}
				
				if (data[0] === 'create') {
					// var template = {msg:['first','second','third']};
					var template = {
						user:"admin",
						pass:"admin",
						msg: ["first","second","third"]
					}
					fs.writeFileSync('messages.json',JSON.stringify(template));
				}

				/////////////	OUTPUTS ALL MESSAGES OR A SPECIFIED ONE
				if (data[0] === 'read') {
					var output = JSON.parse(fs.readFileSync('messages.json','utf8'));
					// prints out the specified message[index] if it exists, else prints out all messages
					if (output.msg[data[1]]) {
						c.write(output.msg[data[1]]);
					}
					else {
						output.msg.forEach(function(stuff,index) {
							c.write("Message "+index+": "+stuff+"\r\n");
						})
					}
				}
				console.log("I'm inside the logged area");
			}
		
		else {
			var accounts = JSON.parse(fs.readFileSync('accounts.json','utf8'));
			if(accounts.user === data[0] && accounts.pass === data[1]){
				logged = true;
				c.write("You're now logged in\r\n");
				c.write("What do you want to do?\r\n");
				c.write("Commands: add (message), del (#), delAll, read (#)\r\n");
			}
			else {
				c.write("Username/Password is wrong.\r\n")
			}
		}

	})

// else {
// 	if (accounts.name === data[0] && accounts.pass === data[1]) {
// 		logged = true;
// 	}
// 	else {
// 		c.write("Wrong username/password");
// 	}
// }
})

server.listen(port,function(){
	console.log("waiting for input...");
})

function add(newMsg) {
	var data = JSON.parse(fs.readFileSync('messages.json','utf8'));
	// console.log(newMsg);
	data.msg.push(newMsg);
	// console.log(data);
	fs.writeFileSync("messages.json",JSON.stringify(data));
}

function del(message) {

}

function delAll(data,client) {
	var init = [{
		// user:"admin",
		// pass:"admin",
		// msg:"message"
	}]
	fs.writeFileSync('messages.json',JSON.stringify(init));
	client.write("All messages have been deleted.");
	// var nothing = [];
	// fs.writeFileSync('messages.json',JSON.stringify(init));
}