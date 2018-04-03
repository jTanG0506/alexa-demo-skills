var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');

// Include data file
var alexaMeetups = require('../data/alexaMeetups');

// Helpers
var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');

var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function() {
    // Check for user data in session attributes
    var userName = this.attributes['userName'];
    if (userName) {
      // Welcome user back by name
      this.emit(':ask', `Welcome back ${userName}! You can ask me about the various alexa meetups around the world or listen to the Alexa Dev Chat podcast.`, 'What would you like to do?');
    } else {
      this.handler.state = constants.states.ONBOARDING;
      this.emitWithState('NewSession');
    }
  },

  'AlexaMeetupNumbers': function() {
    var meetupNumbers = alexaMeetups.length;
    this.emit(':ask', `I currently know of ${meetupNumbers} Alexa developer meetups. Check to see if your city is one of them!`, 'How can I help?');
  },

  'AlexaMeetupCityCheck': function() {
    // Obtain slot values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check which city we actually have
    var city;
    if (USCitySlot) {
      city = USCitySlot;
    } else if (EuropeanCitySlot) {
      city = EuropeanCitySlot;
    } else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that city name.', 'How can I help?');
    }

    // Check whether city has a meetup
    var cityMatch = '';
    for (var i = 0; i < alexaMeetups.length; i++) {
      if (city.toLowerCase() === alexaMeetups[i].city.toLowerCase()) {
        cityMatch = alexaMeetups[i].city;
      }
    }

    // Add London audio
    var londonAudio = ``;
    if (city.toLowerCase() === `london`) {
      londonAudio = `<audio src="https://s3-eu-west-1.amazonaws.com/jtang-voice-devs/london-baby.mp3"/>`
    }

    // Respond to user
    if (cityMatch !== '') {
      this.emit(':ask', `${londonAudio} Yes! ${city} has an Alexa meetup!`, 'How can I help?');
    } else {
      this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }
  },

  'AlexaMeetupOrganiserCheck': function() {
    // Obtain slot values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check which city we actually have
    var city;
    if (USCitySlot) {
      city = USCitySlot;
    } else if (EuropeanCitySlot) {
      city = EuropeanCitySlot;
    } else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that city name.', 'How can I help?');
    }

    // Check whether city has a meetup
    var cityMatch = '';
    var cityOrganisers;
    for (var i = 0; i < alexaMeetups.length; i++) {
      if (city.toLowerCase() === alexaMeetups[i].city.toLowerCase()) {
        cityMatch = alexaMeetups[i].city;
        cityOrganisers = alexaMeetups[i].organisers;
      }
    }

    // Add London audio
    var londonAudio = ``;
    if (city.toLowerCase() === `london`) {
      londonAudio = `<audio src="https://s3-eu-west-1.amazonaws.com/jtang-voice-devs/london-baby.mp3"/>`
    }

    // Respond to user
    if (cityMatch !== '') {
      // Single organiser
      if (cityOrganisers.length === 1) {
        this.emit(':ask', `${londonAudio} The organiser of the ${city} Alexa developer meetup is ${cityOrganisers[0]}`, 'How can I help?');
      } else {
        this.emit(':ask', `${londonAudio} The organisers of the ${city} Alexa developer meetup are ${convertArrayToReadableString(cityOrganisers)}`, 'How can I help?');
      }
    } else {
      this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
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
    this.emit(':ask', 'You can ask me about the various alexa meetups around the world or listen to the Alexa Dev Chat podcast.', 'What would you like to do?');
  },

  'Unhandled': function() {
    this.emitWithState('AMAZON.HelpIntent');
  }
});

module.exports = mainStateHandlers;
