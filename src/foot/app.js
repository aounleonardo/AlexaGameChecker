const http = require('http');
const https = require('https');
const fs = require('fs');

var options = {
    hostname: "api.football-data.org",
    port: 80,
    path: "/v1/fixtures?timeFrame=n30&league=BL1",
    method: "GET",
    headers: {
        'X-Auth-Token': 'dc6856ad360c478bba5e18daafe63818'
    }
}
console.log(options);

// var req = http.request(options, function(res){
//     var responseBody = "";
//
//     console.log("Response from server started.");
//     console.log(`Server Status: ${res.statusCode}`);
//     // console.log("Response Headers: %j", res.headers);
//
//     res.setEncoding("UTF-8");
//     // res.once("data", function(chunk){
//     //     console.log(chunk);
//     // });
//
//     res.on("data", function(chunk){
//         responseBody += chunk;
//     });
//
//     res.on("end", function() {
//         var responseObject = JSON.parse(responseBody);
//         var fixtures = responseObject.fixtures;
//         console.log(fixtures.length);
//         if(fixtures.length > 0){
//             console.log(fixtures[0]);
//         }
//         fs.writeFile("test.json", responseBody, function(err) {
//             if(err){
//                 throw err;
//             }
//             console.log("File Downloaded");
//         });
//     });
//
//     res.on("error", function(err) {
//         console.log(`problem with request: ${err.message}`);
//     });
// });
//
// req.end();
