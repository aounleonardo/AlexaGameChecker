const request = require('request');

var leagues = {
    "bundesliga": {
        "nb_teams": "eighteen",
        "champions": "bayern",
        "code": "BL1"
    },
    "premier league": {
        "nb_teams": "twenty",
        "champions": "chelsea",
        "code": "PL"
    },
    "serie a": {
        "nb_teams": "twenty",
        "champions": "juventus",
        "code": "SA"
    },
    "la liga": {
        "nb_teams": "twenty",
        "champions": "real madrid",
        "code": "PD"
    },
    "ligue un": {
        "nb_teams": "twenty",
        "champions": "monaco",
        "code": "FL1"
    }
}

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    if (event.session.application.applicationId !== "amzn1.ask.skill.dbefb9ef-f98f-4bc9-bd5f-9227973eeca9") {
        context.fail("Invalid Application ID");
     }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;
    // dispatch custom intents to handlers here
    if(intentName == "TodayIntent"){
        handleTodayIntentResponse(intent, session, callback);
    } else if (intentName == "AMAZON.YesIntent") {
        handleYesResponse(intent, session, callback);
    } else if (intentName == "AMAZON.NoIntent") {
        handleNoResponse(intent, session, callback);
    } else if (intentName == "AMAZON.HelpIntent") {
        handleGetHelpRequest(intent, session, callback);
    } else if (intentName == "AMAZON.StopIntent") {
        handleFinishSessionRequest(intent, session, callback);
    } else if (intentName == "AMAZON.CancelIntent") {
        handleFinishSessionRequest(intent, session, callback);
    } else {
        throw "Invalid intent"
    }

}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Welcome to Game Checker, you can get info about these five leagues: bundesliga, premier league, serie a, la liga, ligue un";

    var reprompt = "Which one do you like most? bundesliga, premier league, serie a, la liga, ligue un";

    var header = "Game Checker!";

    var shouldEndSession = false;

    var sessionAttributes = {
        "speechOutput": speechOutput,
        "repromptText": reprompt
    };

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession));
}

function handleTodayIntentResponse(intent, session, callback){
    if(!intent.slots.League.value){
        handleTodayIntentResponseError(intent, session, callback)
    }
    var league = intent.slots.League.value.toLowerCase();

    if(!leagues[league]){
        handleTodayIntentResponseError(intent, session, callback)
    }

    var code = leagues[league].code;
    var speechOutput = "No teams are playing today in the " + league;
    getJSON(code, function(data){
        if(data != "ERROR"){
            speechOutput = data;
        }
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, "", true))
    });
}

function handleTodayIntentResponseError(intent, session, callback){
    var speechOutput = "I personally don't follow this league, or maybe it does not even exist, try one of these: bundesliga, premier league, serie a, la liga, ligue un";
    var reprompt = "Try asking about one of these: bundesliga, premier league, serie a, la liga, ligue un";
    var header = "Unknown League";
    var shouldEndSession = false;
    callback(session.attributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession));
}

function getJSON(code, callback){
    request.get(url(code), function(error, response, body){
        var d = JSON.parse(body);
        var count = d.count;
        if(count > 0){
            var teamA = d.fixtures[0].homeTeamName;
            var teamB = d.fixtures[0].awayTeamName;
            var output = teamA + " are playing against " + teamB;
            callback(output);
        } else {
            callback("ERROR");
        }
    });
}

function url(code){
    return "http://api.football-data.org/v1/fixtures?timeFrame=n30&league=" + code;
}

function handleYesResponse(intent, session, callback){
    var speechOutput = "Great! Which League?";
    var reprompt = speechOutput;
    var shouldEndSession = false;

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, reprompt, shouldEndSession));
}

function handleNoResponse(intent, session, callback){
    handleFinishSessionRequest(intent, session, callback);
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }

    var speechOutput = "I can talk to you about these leagues: bundesliga, premier league, serie a, la liga, ligue un";
    var reprompt = "Which one do you like most? bundesliga, premier league, serie a, la liga, ligue un";

    var shouldEndSession = false;

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, reprompt, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye! Thank you for using Game Checker", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
