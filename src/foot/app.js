const http = require('http');
const https = require('https');
const fs = require('fs');

var options = {
    hostname: "api.football-data.org",
    port: 80,
    path: "/v1/fixtures?timeFrame=n30",
    method: "GET"
}

var req = http.request(options, function(res){

    var responseBody = "";

    console.log("Response from server started.");
    console.log(`Server Status: ${res.statusCode}`);
    // console.log("Response Headers: %j", res.headers);

    res.setEncoding("UTF-8");
    // res.once("data", function(chunk){
    //     console.log(chunk);
    // });

    res.on("data", function(chunk){
        responseBody += chunk;
    });

    res.on("end", function() {
        var responseObject = JSON.parse(responseBody);
        var fixtures = responseObject.fixtures;
        console.log(fixtures.length);
        console.log(fixtures[0]);
        fs.writeFile("george-washington.html", responseBody, function(err) {
            if(err){
                throw err;
            }
            console.log("File Downloaded");
        });
    });

    req.on("error", function(err) {
        console.log(`problem with request: ${err.message}`);
    });
});

req.end();
