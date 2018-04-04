var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');

var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'NewSession': function() {
    // Check for user data in session attributes
    var userName = this.attributes['userName'];
    if (userName) {
      // Change state to MAIN
      this.handler.state = constants.states.MAIN;
      this.emitWithState('LaunchRequest');
    } else {
      this.emit(':ask', 'Welcome to Voice Devs, the skill that gives you information about the alexa developer community. You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev Chat podcast. But first, I\'d like to get to know you better. Tell me your name by saying: My name is, and then your name.', 'Tell me your name by saying: My name is, and then your name.');
    }
  },

  'AMAZON.StopIntent': function() {
    // State automatically saved with :tell tag
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function() {
    // State automatically saved with :tell tag
    this.emit(':tell', 'Goodbye!');
  },

  'SessionEndedRequest': function() {
    // Force the state to save when user times out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent': function() {
    // Username attribute check
    var userName = this.attributes['userName'];

    if (userName) {
      this.emit(':ask', 'Please tell me what country you\'re from by saying: I am from, and then the country you\'re from.', 'Tell me what country you\'re from by saying: I am from, and then the country you\'re from.');
    } else {
      this.emit(':ask', 'Please tell me what country you\'re from by saying: I am from, and then the country you\'re from.', 'Tell me what country you\'re from by saying: I am from, and then the country you\'re from.');
    }
  },

  'Unhandled': function() {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = onboardingStateHandlers;
