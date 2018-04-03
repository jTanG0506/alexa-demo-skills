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

  'NameCapture': function() {
    // Obtain slot values
    var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
    var UKFirstNameSlot = this.event.request.intent.slots.UKFirstName.value;

    // Get the users name
    var name;
    if (USFirstNameSlot) {
      name = USFirstNameSlot;
    } else if (UKFirstNameSlot) {
      name = UKFirstNameSlot;
    }

    // Save name in session attributes
    if (name) {
      this.attributes['userName'] = name;
      this.emit(':ask', `Ok, ${name}! Tell me what country you're from by saying: I am from, and then the country you\'re from.`, 'Tell me what country you\'re from by saying: I am from, and then the country you\'re from.');
    } else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that name. Please tell me your name by saying: My name is, and then your name.', 'Please tell me your name by saying: My name is, and then your name.');
    }
  },

  'CountryCapture': function() {
    // Obtain slot values
    var country = this.event.request.intent.slots.Country.value;

    // Get user name from session attributes
    var userName = this.attributes['userName'];

    // Save country name to session attributes
    if (country) {
      this.attributes['userCountry'] = country;

      // Change state to MAIN
      this.handler.state = constants.states.MAIN;

      this.emit(':ask', `Ok, ${userName}! You're from ${country}, that's great! You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev postcast. What would you like to do?`, 'What would you like to do?');
    } else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that country. Please tell me what country you\'re from by saying: I am from, and then the country you\'re from.', 'Please tell me what country you\'re from by saying: I am from, and then the country you\'re from.');
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
