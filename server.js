'use strict';

var express = require('express');
var app = express();
var strftime = require("strftime");


app.get("/:query", function(req, res) {
    var output = parseQuery(req.params.query);
    res.end(JSON.stringify(output));
    console.log(output);
})

var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
	console.log('Node.js listening on port ' + port + '...');
	console.log("Listening at address " + server.address().address)
});

function parseQuery(query) {
	if (!isNaN(query)) {
		//convert to readable time
		var unix = parseInt(query);
		var readable = strftime("%B %e, %Y", new Date(unix));
	} else {
		//Check if it is a readable date
		
		try {
			var readable = checkForReadable(query);
		} catch (err) {
			console.log(err);
			return { 
				"unix": null, 
				"natural": null
				
			};
		}
		try {
			var unix = new Date(readable).getTime();
		} catch (err) {
			console.log(err);
			return {
				"unix": null,
				"natural": null
			}
		}
	}
	return {
			"unix": unix,
			"natural": readable
		};
}

function checkForReadable(query) {
	
	var regex = new RegExp(/[\ ,\-\\\/]/g);
	var queryArray = query.split(regex);
	var arrayLength = queryArray.length;
	
	while (arrayLength > 3) {
		
		var smallestPosition = 0;
		var smallestLength = queryArray[0].length;
		
		for (var i = 1; i < arrayLength; i++) {
			if (queryArray[i].length < smallestLength) {
				smallestPosition = i;
				smallestLength = queryArray[i].length;
			}
		}
		//console.log(queryArray[3].length + "   " +  smallestPosition);
		queryArray.splice(smallestPosition, 1);
		arrayLength--;
	}
	if (arrayLength === 3) {
		return queryArray[0] + " " + queryArray[1] + ", " + queryArray[2];
	} else {
		throw "Query String contains less than 3 data points."
	}
}