const context = require("aws-lambda-mock-context");
var expect = require("chai").expect;
var index = require("../src/index");

const ctx = context();

describe("Testing The FactIntent", function(){
    var speechResponse = null;
    var speechError = null;

    before(function(done) {
        index.handler({
            "session": {
                "sessionId": "SessionId.21e29a4a-8d45-467d-b384-414ef0a90207",
                "application": {
                  "applicationId": "amzn1.ask.skill.dbefb9ef-f98f-4bc9-bd5f-9227973eeca9"
                },
                "attributes": {},
                "user": {
                  "userId": "amzn1.ask.account.AF7YMIXVW6KUND67IWBSG6RJLGZAR5EMGOTW7ZN4YJTWHBUXRKB5EOCPFKDJFR6WT624WQA72NRB3WUVDV7OH4PH7WGWN47TNTKDNKJDA5FRQ6IOG53OUTZU7U3WL3EYP6NSFZCVP25HNAHCGLNSAJUTKO4EPZKFP4JVWEP7ZOVKV5ET5U2FYI7VJBHVYOOWAWYY4R4X4P3RXWQ"
                },
                "new": false
            },
            "request": {
                "type": "IntentRequest",
                "requestId": "EdwRequestId.f31f7102-8809-4c49-b126-a4e7be2d5101",
                "locale": "en-US",
                "timestamp": "2017-07-24T00:49:33Z",
                "intent": {
                    "name": "TodayIntent",
                    "slots": {
                        "League": {
                            "name": "League",
                            "value": "serie a"
                        }
                  }
                }
            },
            "version": "1.0"
        }, ctx);
        ctx.Promise
            .then(response => {speechResponse = response; console.log(speechResponse); done();})
            .catch(error => {speechError = error; done();})
    });

    describe("Is the response structurally correct", function(){
        it("should not have errored", function(){
            expect(speechError).to.be.null;
        });
    });

});
