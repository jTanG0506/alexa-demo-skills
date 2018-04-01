// Random Maths Facts
// Simple Alexa Skill that returns a random Real Analysis facts when asked.
// Note: Marcus Tressl is a lecturer at University of Manchester.
//
// Example Interaction:
//  User: "Alexa, ask Marcus Tressl give me some real analysis"
// Alexa: "Every monotone and bounded sequence has a limit"

// App ID
var APP_ID = undefined;

// Array of Real Analysis definitions, lemmas, theorems and a cheeky extra.
var FACTS = [
  "A sequence is called monotone if it is increasing or decreasing.",
  "A null sequence is a sequence that converges to 0.",
  "Every monotone and bounded sequence has a limit.",
  "Every convergent sequence is bounded.",
  "Every non empty subset S of the reals which has an upper bound, has a least upper bound.",
  "Every absolutely convergent series is convergent",
  "If you can't find the solution in the notes or the example sheets, then you haven't revised properly"
]

var AlexaSkill = require('./AlexaSkill')

var Fact = function() {
  AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Fact.prototype = Object.create(AlexaSkill.prototype);
Fact.prototype.constructor = Fact;

Fact.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {};

Fact.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
  handleNewFactRequest(response);
};

Fact.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {};

Fact.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say give me some real analysis, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

// Gets a random quote from Marcus and returns it to the user.
function handleNewFactRequest(response) {
    // Get a random fact from the list defined above.
    var factIndex = Math.floor(Math.random() * FACTS.length);
    var randomFact = FACTS[factIndex];

    // Create speech output
    var speechOutput = randomFact;
    var cardTitle = "Your Fact";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var fact = new Fact();
    fact.execute(event, context);
};
