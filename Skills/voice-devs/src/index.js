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

    // Respond to user
    if (cityMatch !== '') {
      this.emit(':ask', `Yes! ${city} has an Alexa meetup!`, 'How can I help?');
    } else {
      this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }
  }
};
