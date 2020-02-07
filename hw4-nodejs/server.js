/* set all modules as constants */
const express = require("express");

// default to port 8081 since that's EB's Node.js platform default port
var hostname = "127.0.0.1";
var port = 8081;
var app = express();


// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/public/index.html');
// });
// set up express.js reference
app.use(express.static(__dirname + "/public"));


// MARK: - users

// listen to port
app.listen(port);
console.log("server up and running on: " + hostname + " and listening to port: " + port);
