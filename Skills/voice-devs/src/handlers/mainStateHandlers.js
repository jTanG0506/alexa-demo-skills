var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');

// Data
var alexaMeetups = require('../data/alexaMeetups');

// Helpers
var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');
var meetupAPI = require('../helpers/meetupAPI');
var checkMeetupCity = require('../helpers/checkMeetupCity');
var getLondonAudio = require('../helpers/getLondonAudio');
var alexaDateUtil = require('../helpers/alexaDateUtil');


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

    // Check city match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to user
    if (cityMatch) {
      this.emit(':ask', `${getLondonAudio(cityMatch.city)} Yes! ${cityMatch.city} has an Alexa meetup!`, 'How can I help?');
    } else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }
  },

  'AlexaMeetupOrganiserCheck': function() {
    // Obtain slot values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check city match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to user
    if (cityMatch) {
      // Get access token from Alexa request and check if account is linked
      var accessToken = this.event.session.user.accessToken;
      if (accessToken) {
        // Get meetup group details from API
        meetupAPI.GetMeetupGroupDetails(accessToken, cityMatch.meetupURL)
        .then((meetupDetails) => {
          // Get organiser name
          var organiserName = meetupDetails.organizer.name;

          var cardTitle = `${organiserName}`;
          var cardContent = `The organiser of the ${cityMatch.city} Alexa developer meetup is ${organiserName}`;

          var imageObj = {
            smallImageUrl: `${meetupDetails.organizer.photo.photo_link}`,
            largeImageUrl: `${meetupDetails.organizer.photo.photo_link}`
          };

          // Respond to user
          this.emit(':askWithCard', `${getLondonAudio(cityMatch.city)} The organiser of the ${cityMatch.city} Alexa developer meetup is ${organiserName}`, 'How can I help?', cardTitle, cardContent, imageObj);
        })
        .catch((error) => {
          // API error.
          console.log("MeetupAPI Error: ", error);
          this.emit(':tell', 'Sorry, there was a problem accessing your meetup account details.');
        });
      } else {
        this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skill. I\'ve sent the details to your Alexa app');
      }
    } else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }
  },

  'AlexaMeetupMembersCheck': function() {
    // Obtain slot values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check city match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to user
    if (cityMatch) {
      // Get access token from Alexa request and check if account is linked
      var accessToken = this.event.session.user.accessToken;
      if (accessToken) {
        // Get meetup group details from API
        meetupAPI.GetMeetupGroupDetails(accessToken, cityMatch.meetupURL)
        .then((meetupDetails) => {
          // Get number of members in group
          var meetupMembers = meetupDetails.members;

          // Respond to user
          this.emit(':ask', `${getLondonAudio(cityMatch.city)} The ${cityMatch.city} Alexa developer meetup has ${meetupMembers} members - Nice! How else can I help you?`, 'How can I help?');
        })
        .catch((error) => {
          // API error.
          console.log("MeetupAPI Error: ", error);
          this.emit(':tell', 'Sorry, there was a problem accessing your meetup account details.');
        });
      } else {
        this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skill. I\'ve sent the details to your Alexa app');
      }
    } else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
    }
  },

  'AlexaNextMeetupCheck': function() {
    // Obtain slot values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Check city match
    var cityMatch = checkMeetupCity(USCitySlot, EuropeanCitySlot);

    // Respond to user
    if (cityMatch) {
      // Get access token from Alexa request and check if account is linked
      var accessToken = this.event.session.user.accessToken;
      if (accessToken) {
        // Get meetup group details from API
        meetupAPI.GetMeetupGroupDetails(accessToken, cityMatch.meetupURL)
        .then((meetupDetails) => {
          // Get the date of next meetup
          var nextEvent = meetupDetails.next_event;

          if (nextEvent) {
            var nextEventDate = new Date(nextEvent.time);

            this.emit(':ask', `${getLondonAudio(cityMatch.city)} The next ${cityMatch.city} Alexa developer meetup is on ${alexaDateUtil.getFormattedDate(nextEventDate)} at ${alexaDateUtil.getFormattedTime(nextEventDate)}! Currently ${nextEvent.yes_rsvp_count} members have RSVP'd. How else can I help you?`, 'How can I help?');
          } else {
            this.emit(':ask', `${getLondonAudio(cityMatch.city)} There's currently no upcoming meetups in ${cityMatch.city}. You should chase the organiser, ${meetupDetails.organizer.name} to schedule one! How else can I help you?`, 'How can I help?');
          }
        })
        .catch((error) => {
          // API error.
          console.log("MeetupAPI Error: ", error);
          this.emit(':tell', 'Sorry, there was a problem accessing your meetup account details.');
        });
      } else {
        this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skill. I\'ve sent the details to your Alexa app');
      }
    } else {
      this.emit(':ask', `Sorry, looks like ${(USCitySlot || EuropeanCitySlot)} doesn't have an Alexa developer meetup yet - why don't you start one?`, 'How can I help?');
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
