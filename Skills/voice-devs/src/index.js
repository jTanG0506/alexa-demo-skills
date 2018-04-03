var Alexa = require('alexa-sdk');

// Include data file
var alexaMeetups = require('./data/alexaMeetups');

// Helpers
var convertArrayToReadableString = require('./helpers/convertArrayToReadableString');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

// Define handler functions below.
var handlers = {

  'NewSession': function() {
    this.emit(':ask', 'Welcome to Voice Devs, the skill that gives you information about the alexa developer community. You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev Chat podcast. But first, I\'d like to get to know you better. Tell me your name by saying: My name is, and then your name.', 'Tell me your name by saying: My name is, and then your name.');
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

    // Save country name to session attributes then ask for favourite language
    if (country) {
      this.attributes['userCountry'] = country;
      this.emit(':ask', `Ok, ${userName}! You're from ${country}, that's great! You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev postcast. What would you like to do?`, 'What would you like to do?');
    } else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that country. Please tell me what country you\'re from by saying: I am from, and then the country you\'re from.', 'Please tell me what country you\'re from by saying: I am from, and then the country you\'re from.');
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
  }
};
