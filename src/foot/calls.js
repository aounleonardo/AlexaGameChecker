const querystring = require('querystring');
const http = require('http');

const host = 'api-football-data.org';
const apiKey = 'dc6856ad360c478bba5e18daafe63818';

module.exports = {
    getGamesToday : getGamesToday
}

function performRequest(endpoint, method, data, success) {
    var dataString = JSON.stringify(data);
    var headers = {};

      if (method == 'GET') {
        endpoint += '?' + querystring.stringify(data);
      }
    else {
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        };
    }
    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            console.log(responseString);
            var responseObject = JSON.parse(responseString);
            success(responseObject);
        });
    });

    req.write(dataString);
    req.end();
}

// function getGamesToday(callback) {
//     performRequest('/v1/competitions', 'GET',
//     {
//         session_id: 'a',
//     }, callback);
// }
function getGamesToday(callback) {
    var options = {
        host: 'api.football-data.org',
        path: '/v1/competitions/?season=2017',
        method: 'GET',
        port: 80
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            var responseObject = JSON.parse(responseString);
            callback(Object.keys(responseObject).length);
        });
    });

    req.end();
    callback("qwerty");
}
