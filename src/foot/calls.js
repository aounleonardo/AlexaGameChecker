const querystring = require('querystring');
const http = require('http');

const host = "api.football-data.org";
const apiKey = "dc6856ad360c478bba5e18daafe63818";
const fs = require('fs');

// module.exports = {
//     getGamesToday : getGamesToday,
//     performRequest : performRequest
// }

function performRequest(endpoint, method, data, success) {
    var dataString = JSON.stringify(data);
    var headers = {};

    if (method == 'GET') {
        endpoint += '?' + querystring.stringify(data);
        headers = {
            'X-Auth-Token': 'dc6856ad360c478bba5e18daafe63818'
        };
    }
    else {
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length,
            'X-Auth-Token': 'dc6856ad360c478bba5e18daafe63818'
        };
    }

    var options = {
        hostname: host,
        port: 80,
        path: endpoint,
        method: method,
        headers: headers
    }
    console.log("d");
    console.log(options);

    var req = http.request(options, function(res){

        var responseBody = "";

        console.log("Response from server started.");
        console.log(`Server Status: ${res.statusCode}`);

        res.setEncoding("UTF-8");
        // res.once("data", function(chunk){
        //     console.log(chunk);
        // });

        res.on("data", function(chunk){
            responseBody += chunk;
        });

        res.on("end", function() {
            console.log("c");
            var responseObject = JSON.parse(responseBody);
            var fixtures = responseObject.fixtures;

            fs.writeFile("test.json", responseBody, function(err) {
                if(err){
                    throw err;
                }
                console.log("File Downloaded");
            });
        });
        res.on("error", function(err) {
            console.log(`problem with request: ${err.message}`);
        });
    });
    req.write(dataString);
    req.end();
}

function getGamesToday(callback) {
    callback("qwerty");
    performRequest('/v1/fixtures', 'GET', {'timeFrame': 'n30', 'league': 'BL1'}, function (a) {
        console.log("uiop");
    });
}

getGamesToday(function (a) {
    console.log(a);
})
