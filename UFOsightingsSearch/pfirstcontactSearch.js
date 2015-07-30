var http = require('http'); //includes the http package 
var url = require('url'); //includes the url package
var fs = require('fs');

var server = http.createServer().listen(3000);

server.on('request', function(request, response) {
	var link = url.parse(request.url);
	
	var path = link.pathname;
	// console.log(path);
	var query = link.query;
	// console.log(query);
	if (path!=='/favicon.ico') {
		console.log(link);

	}
		
	if (path ==='/sightings' && query) {

		queryParts = query.split('=');
		console.log(queryParts[0]);
		console.log(queryParts[1]);
		// var found = false;
		var sightings = JSON.parse(fs.readFileSync('sightings.json','utf8'));
		var list = [];

		// SEARCH BY SHAPE
		if (queryParts[0].toLowerCase() === 's') {
			console.log("Searching for shape...")
			sightings.forEach(function(occur) {
				if (queryParts[1].toLowerCase() === occur.shape.toLowerCase()) {
					console.log("Shape match found!")
					list.push(occur);
				}
			})
		}
		// SEARCH BY LOCATION
		else if (queryParts[0].toLowerCase() === 'l') {
			console.log("Searching for location...");
			queryParts[1] = queryParts[1].replace(/\%2c/ig,',').replace(/\%20/ig,' ');
			// console.log(queryParts[1]);
			// queryParts[1] = queryParts[1]
			// console.log(queryParts[1]);
			// queryParts[1] = queryParts[1].replace(/\%2c|\%20/ig,function(x) {
			// 	if (x.match(/%2c/ig)) {
			// 		return ","
			// 	}
			// 	else {
			// 		return " ";
			// 	}
			// })
			var lookfor = new RegExp("\\b"+queryParts[1]+"\\b",'i');
			sightings.forEach(function(occur) {
				if (occur.location.match(lookfor)) {
					list.push(occur)
				}
			})
		}
		//SEARCH BY DATE
		else if (queryParts[0].toLowerCase() === 'd') {
			console.log("Searching for date...");
			var lookfor = new RegExp("\\b"+queryParts[1]+"\\b");
			sightings.forEach(function(occur) {
				if (occur.occurred.match(lookfor)) {
					list.push(occur);
				}
			})
		}
		//SEARCH BY ID
		else if (queryParts[0].toLowerCase() === 'id') {
			console.log("Searching for ID...")
			sightings.forEach(function(occur) {
				if (queryParts[1] === occur.id.toString()) {
					console.log("ID match found!")
					list.push(occur);
				}
			})
		}
		
		//////  PRINT OUT LIST AFTER PERFORMING ABOVE SEARCH CONDITIONS
		if (list.length) {
			response.writeHead(200, {'content-type':'application/json'});
			response.write(JSON.stringify(list));
			response.end();
		}	
		else if (!list.length) {
			response.writeHead(200, {'content-type':'application/json'});
			response.write('{ error : "There is no such sighting!"}');
			response.end();
		}
	}

	else if (path === '/') {
		response.writeHead(200, {'content-type':'text/html'});
		response.write('<!DOCTYPE html><html lang="en"><head></head>');
		response.write('<body><h1>You are entering a forbidden zone</h1>');
		response.write('<p>Query Keys: <ul><li>s= shape</li><li>l= location</li><li>d= date</li><li>id= ID#</li><ul></body></html>');
		response.end();
	}

	///////////// LISTS ALL SIGHTINGS
	else if (path === '/sightings') {
		response.writeHead(200, { 'Content-Type': 'application/json' });
		response.write(fs.readFileSync('sightings.json','utf8'));
		response.end();
	}

	else {
		response.writeHead(400, {'content-type':'text/html'});
		response.write("Bad Request");
		response.end();
	}

});





