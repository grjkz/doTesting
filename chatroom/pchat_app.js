var fs = require('fs');
var net = require('net');
var chalk = require('chalk');
var port = 3000;
var users = [];
var history = [];
var showHistory = false;
var emoticons = {
	sorry: ["(シ_ _)シ", "m(_ _)m", "๑•́ㅿ•̀๑) ᔆᵒʳʳᵞ"],
	angry: ["٩(╬ʘ益ʘ╬)۶", "＼＼\\\\٩(๑`^´๑)۶//／／", "୧▒ •̀ o •́ ▒୨", "(ノ≧┏Д┓≦)ノ", "(｡☉︵ ಠ╬)", "（▼へ▼メ）", "☜(`o´)", "凸ಠ益ಠ)凸"],
	fight: ["ヽ(#ﾟДﾟ)ﾉ┌┛", "(૭ ఠ༬ఠ)૭", "~‾͟͟͞(((ꎤ >ㅿ<)̂—̳͟͞͞o", "ヽ(#ﾟДﾟ)ﾉ┌┛Σ(ノ´Д`)ノ", "⁽⁽(੭ꐦ •̀Д•́ )੭*⁾⁾ ᑦᵒᔿᵉ ᵒᐢᵎᵎ"],
	bear: ["ᶘ ᵒᴥᵒᶅ", "( ິ•ᆺ⃘• )ິฅ✧", "ᶘ ͡°ᴥ͡°ᶅ", "ต( ິᵒ̴̶̷̤́ᆺ⃘ᵒ̴̶̷̤̀ )ິต", "ᵔᴥᵔ", "ʕ≧㉨≦ʔ", "ʕ ˵ ͒ ʖ̯ ͒ ˵ ʔ", "ʕ•̫͡•ོʔ•̫͡•ཻʕ•̫͡•ʔ•͓͡•ʔ"]		
}

// telnet 127.0.0.1 3000

var server = net.createServer(function(c) {
	history = JSON.parse(fs.readFileSync('history.json','utf8'));
	
	
	process.stdin.on('data',function(input) {
		c.write(input+"\r\n");
	})
	// var empty = []
	// fs.writeFileSync('history.json', JSON.stringify(empty));
	users.push(c);
	console.log(users.length+" users connected");
	
	/////// user enters a name before they can chat
	c.write("Enter a (inoffensive) username\r\n");

	c.on('data',function(data) {
		data = data.toString().trim();
		console.log(data);

		if (!c.name) { ///////// if the client doesnt have a name yet, next input is their name
			c.name = data;
			users.forEach(function(client) {
				client.write(chalk.green(data+" has joined the room\r\n"));
			})
			history.push(data+" has joined the room\r\n");
			c.write("######################BEGIN CHAT HISTORY######################\r\n");
			c.write(history.join(''));
			c.write("#######################END CHAT HISTORY#######################\r\n");
			fs.writeFileSync('history.json',JSON.stringify(history));
		}
		// else if (c.name && !showHistory) {
		// }
		else {
			if (data === '/help') {
				c.write("                    _________\r\n");
				c.write("___________________/Commands:\\___________________\r\n");
				c.write("|/yell (text) - CAPITALIZES YOUR TEXT (or random)|\r\n");
				c.write("|/users - Shows all users currently in this room |\r\n");
				c.write("|/w username - whispers to specified user        |\r\n");
				c.write("|                ***Emoticons***                 |\r\n");
				c.write("|/tableflip - Display emoticon                   |\r\n");
				c.write("|/angry /bear/ /sorry /fight - Display Random one|\r\n");
				c.write("|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|\r\n");
			}

			else if (data.match(/^\/yell/)) {
				data = data.substring(6);
				if (data.length) {
					console.log("substring+UPPER used: "+data);
					text(c, data.toUpperCase());
				}
				else {
					var screams = ["AAAAAHHHHHHHHH!!!!!!!!!!", "YARRR!!!", "FUCCKKK!", "SHIT!", "NOOOOOOOOOOOOOOOOOO!", "I SCREAM, YOU SCREAM, WE ALL SCREAM FOR ICE CREAM!", "STELLLAAAAAA!!!"];
					var scream = screams[Math.floor(Math.random()*screams.length)];
					text(c, scream);
					c.write(scream+"\r\n");
				}
			}


			///////// PRIVATE MESSAGING
			else if (data.match(/^\/w/)) {
				var inRoom = false;
				data = data.split(' ');
				data.shift();
				var wName = data.shift();
				data = data.join(' ');

				users.forEach(function(client, index) {
					if (client.name === wName) {
						console.log("user found");
						users[index].write(data+"\r\n");
						inRoom = true;
					}
				})
				if (!inRoom) {
					console.log("User not found");
				}
			}
			
			else if (data === '/users') {
					// USE WHEN YOU HAVE AN OBJECT OF ROOM NAMES THAT ARE UNKNOWN
					// for (var key in arr) {
					// 	arr[key].forEach(function(x) {
					// 	c.write(x);  
					// 	})
					// }
					c.write("*************************************\r\n");
					c.write(users.length+" clowns are currently in this room:\r\n");
					users.forEach(function(client) {
						c.write(client.name+"\r\n");
					})
					c.write("*************************************\r\n");
			}

			//////////////// EMOTICONS
			else if (data === '/bear') {
				var image = emoticons.bear[Math.floor(Math.random()*emoticons.bear.length)];
				text(c, image);
				c.write(image+"\r\n");
			}
			else if (data === '/sorry') {
				var image = emoticons.sorry[Math.floor(Math.random()*emoticons.sorry.length)];
				text(c, image);
				c.write(image+"\r\n");
			}
			else if (data === "/angry") {
				var image = emoticons.angry[Math.floor(Math.random()*emoticons.angry.length)];
				text(c, image);
				c.write(image+"\r\n");
			}
			else if (data === "/fight") {
				var image = emoticons.fight[Math.floor(Math.random()*emoticons.fight.length)];
				text(c, image);
				c.write(image+"\r\n");
			}
			else if (data === '/tableflip') {
				text(c, "(╯°□°）╯︵ ┻━┻");
				c.write("(╯°□°）╯︵ ┻━┻\r\n");
			}

			else {
				if (data.length) {
					// console.log("pass");
					text(c, data);
				}
			}
		}

	});


	c.on('end',function() {
		var name = c.name;
		users.splice(users.indexOf(this),1); // removes the user from the 'users' array
		users.forEach(function(client) {	// tells all remaining users who left.
			client.write(chalk.red(name+" has left the room\r\n"));

		})
		history.push(name+" has left the room\r\n");
		fs.writeFileSync('history.json',JSON.stringify(history));
		//////////// tells the console how many users exist in the chat room
		if (users.length) {
			console.log(users.length+" users left");
		}
		else {
			console.log("Last user has left");
		}
		// console.log(users.length+" users still connected");
	})

})

server.listen(port,function() {
	console.log("Chat app has started");
})


function text(typer, input) {
	users.forEach(function(client) {
		if (typer.name !== client.name) {
			client.write(typer.name+": "+input+"\r\n");
		}
	})
	history.push(typer.name+": "+input+"\r\n");
	// console.log(history);
	fs.writeFileSync('history.json',JSON.stringify(history));
}