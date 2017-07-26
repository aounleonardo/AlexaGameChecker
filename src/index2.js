'use strict';
const Alexa = require('alexa-sdk');
const path = require('path');
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

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

var teamA = "";
var teamB = "";

const handlers = {
    'TodayIntent': function () {
        var speechOutput = teamA + " will play against " + teamB;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
    }
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = 'amzn1.ask.skill.dbefb9ef-f98f-4bc9-bd5f-9227973eeca9';
    alexa.registerHandlers(handlers);


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
            var responseObject = JSON.parse(body);
            var fixtures = responseObject.fixtures;
            if(fixtures.length > 0){
                var fixture = fixtures[0];
                teamA = fixture.homeTeamName;
                teamB = fixture.awayTeamName;
                alexa.execute();
            }
        });
        context.succeed();
    });
    req.end();
};

// exports.handler = function(event, context) {
//
//     var body='';
//     var jsonObject = JSON.stringify(event);
//     var teamA = "";
//     var teamB = "";
//     var tthis = this;
//
//     var options = {
//         host: 'api.football-data.org',
//         path: '/v1/fixtures?timeFrame=n30&league=BL1',
//         method: 'GET',
//     };
//
//     var req = http.get('http://api.football-data.org/v1/fixtures?timeFrame=n30&league=BL1', function(res) {
//         console.log("statusCode: ", res.statusCode);
//         res.on('data', function (chunk) {
//             body += chunk;
//         });
//         res.on('end', function(){
//             var responseObject = JSON.parse(body);
//             var fixtures = responseObject.fixtures;
//             if(fixtures.length > 0){
//                 var fixture = fixtures[0];
//                 teamA = fixture.homeTeamName;
//                 teamB = fixture.awayTeamName;
//             }
//             var speechOutput = teamA + " will play against " + teamB;
//             console.log("speechOutput: " + speechOutput);
//             tthis.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
//         });
//         context.succeed('Blah');
//     });
//     req.end();
// }
