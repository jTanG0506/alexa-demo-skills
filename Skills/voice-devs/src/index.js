var Alexa = require('alexa-sdk');

// Include data file
var alexaMeetups = require('./data/alexaMeetups');

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
  },
  'AlexaMeetupNumbers': function() {
    var meetupNumbers = alexaMeetups.length;
    this.emit(':ask', `I currently know of ${meetupNumbers} Alexa developer meetups. Check to see if your city is one of them!`, 'How can I help?');
  }
};
