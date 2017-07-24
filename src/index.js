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
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function blah(callback){
    var options = {
        host: 'api.football-data.org',
        path: '/v1/competitions/?season=2017',
        method: 'GET',
        port: 80
    };
    console.log("hola");

    http.get("http://www.google.com", function(res) {
        console.log("Got response: ");
        fs.writeFile("test", "Hey there!", function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    });

    var req = http.request(options, function(res) {
        hey = "heyaa";
        console.log("heya\n\n");
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            var responseObject = JSON.parse(responseString);
            if(responseString == null){
                callback("booooo");
            } else {
                callback("baaaaa");
            }
            console.log(Object.keys(responseObject).length);
        });
    });

    req.end();
    callback("qwerty");
    callback("uiop");

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
        console.log("hello\n");
        var speechOutput = "beautiful games today";
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput)
    },
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
