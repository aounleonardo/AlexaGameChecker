'use strict';
const Alexa = require('alexa-sdk');
const path = require('path');
const facts = require('./facts');
const calls = require('./foot/calls');
const http = require('http');
const fs = require('fs');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = undefined;

var SKILL_NAME = "Game Checker";
var GET_FACT_MESSAGE = "Here's your fact: ";
var HELP_MESSAGE = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const host = "api.football-data.org";
const apiKey = "dc6856ad360c478bba5e18daafe63818";
const querystring = require('querystring');

function performRequest(endpoint, method, data, success) {
    var dataString = JSON.stringify(data);
    var headers = {};

    if (method == 'GET') {
        endpoint += '?' + querystring.stringify(data);
        headers = {
            'X-Auth-Token': apiKey
        };
    }
    else {
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length,
            'X-Auth-Token': apiKey
        };
    }

    var options = {
        hostname: "api.football-data.org",
        port: 80,
        path: '/v1/fixtures?timeFrame=n30&league=BL1',
        method: 'GET'
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
            success("b");
            if(fixtures.length > 0){
                success(fixtures[0]);
            }

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


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function simple(event, context) {

    var body='';
    var jsonObject = JSON.stringify(event);

    var options = {
        host: 'api.football-data.org',
        path: '/v1/fixtures?timeFrame=n30&league=BL1',
        method: 'GET',
    };

    var req = http.get('http://api.football-data.org/v1/fixtures?timeFrame=n30&league=BL1', function(res) {
        console.log("statusCode: ", res.statusCode);
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function(){
            console.log(body);
        });
        context.succeed('Blah');
    });
    // var req = http.request(options, function(res) {
    //     console.log("statusCode: ", res.statusCode);
    //     res.on('data', function (chunk) {
    //         body += chunk;
    //     });
    //     res.on('end', function(){
    //         console.log(body);
    //     });
    //     context.succeed('Blah');
    // });

    // req.write(jsonObject, function(err){
    //     req.end();
    // });
    req.end();
}

var handlers = {
    'LaunchRequest': function () {
        this.emit('FactIntent');
    },
    'FactIntent': function () {
        var factArr = facts.data;
        var factIndex = Math.floor(Math.random() * factArr.length);
        var randomFact = factArr[factIndex];
        var speechOutput = GET_FACT_MESSAGE + randomFact;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
    },
    'TodayIntent': function () {
        getGamesToday(function(a){
            console.log("hey");
            console.log(a);
        });
        var speechOutput = "beautiful games today";
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput)
    },
    // 'TodayIntent': function () {
    //     getGamesToday(function(a){
    //         console.log("hey");
    //         console.log(a);
    //     });
    //     var speechOutput = "beautiful games today";
    //     this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput)
    // },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};
