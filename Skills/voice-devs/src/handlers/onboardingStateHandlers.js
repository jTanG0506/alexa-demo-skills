var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');

var meetupAPI = require('../helpers/meetupAPI');

var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'NewSession': function() {
    // Check for user data in session attributes
    var userName = this.attributes['userName'];
    if (userName) {
      // Change state to MAIN
      this.handler.state = constants.states.MAIN;
      this.emitWithState('LaunchRequest');
    } else {
      // Get access token
      var accessToken = this.event.session.user.accessToken;

      // Check if account is linked or not.
      if (accessToken) {
        meetupAPI.GetUserDetails(accessToken)
        .then((userDetails) => {
          // Get the users name and store it in the session.
          var name = userDetails.name;
          this.attributes['userName'] = name;

          // Change state to MAIN
          this.handler.state = constants.state.MAIN;

          // Welcome user for the first time
          this.emit(':ask', `Hi ${name}! Welcome to Voice Devs! The skill that gives you all the information about the Alexa developer community. You can ask me about the various Alexa meetups around the world, or listen to the Alexa Dev Chat podcast. What would you like to do?`, 'What would you like to do?');
        })
        .catch((error) => {
          // API error.
          console.log("MeetupAPI Error: ", error);
          this.emit(':tell', 'Sorry, there was a problem accessing your meetup account details.');
        });
      } else {
        this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skill. I\'ve sent the details to your Alexa app');
      }
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
    // Help in this state means account is not linked.
    this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skill. I\'ve sent the details to your Alexa app');
  },

  'Unhandled': function() {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = onboardingStateHandlers;
