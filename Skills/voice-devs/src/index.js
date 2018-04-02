// Boilerplate code for the lambda function for an Alexa Skill in ASK.

var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

// Define handler functions below.
var handlers = {
  'LaunchRequest': function() {
    this.emit(':ask', 'Welcome to voice devs!', 'Try saying hello!');
  },
  'HelloIntent': function() {
    this.emit(':tell', 'Hi there!');
  }
};
