var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Data
var alexaDevChatPodcasts = require('../data/alexaDevChatPodcasts');

// Audio Player Handlers
var audioPlayerHandlers = Alexa.CreateStateHandler(constants.states.AUDIO_PLAYER, {

  // Return to MAIN state on LaunchRequest
  'LaunchRequest': function() {
    this.handler.state = constants.states.MAIN;
    this.emit(':saveState', true);
  },

  // Main Audio Player Intent - Start a podcast
  'PlayPodcast': function() {
    // Get episode slot
    var episodeSlot = parseInt(this.event.request.intent.slots.Episode.value);

    // Play specific episode if requested and valid
    if (episodeSlot > 0 && episodeSlot <= alexaDevChatPodcasts.length) {
      this.attributes['currentEpisode'] = episodeSlot;
      this.attributes['offsetInMilliseconds'] = 0;

      // Speech Output
      this.response.speak(`Playing episode ${episodeSlot} of the Alexa Dev Chat podcast.`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[episodeSlot - 1].audioURL, episodeSlot, null, 0);

      // Build response and send to Alexa
      this.emit(':responseReady');
    } else if (episodeSlot) {
      // Invalid episode number
      this.handler.state = constants.states.MAIN;
      this.emit(':tell', `Sorry, there are currently only ${alexaDevChatPodcasts.length} Alexa Dev Chat podcast episodes. Tweet Dave Isbitski @ the dave dev to get the next one recorded.`);
    } else {
      this.attributes['currentEpisode'] = alexaDevChatPodcasts.length;
      this.attributes['offsetInMilliseconds'] = 0;

      // Speech Output
      this.response.speak(`Playing latest episode: Episode ${alexaDevChatPodcasts.length} of the Alexa Dev Chat podcast.`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[alexaDevChatPodcasts.length - 1].audioURL, alexaDevChatPodcasts.length, null, 0);

      // Build response and send to Alexa
      this.emit(':responseReady');
    }
  },

  // Audio Control Intents - Intent Request Handlers
  'AMAZON.PauseIntent': function() {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
  },

  'AMAZON.StopIntent': function() {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
  },

  'AMAZON.CancelIntent': function() {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
  },

  'AMAZON.ResumeIntent': function() {
    // Get Audio Player Session Attributes
    var currentEpisode = this.attributes['currentEpisode'];
    var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];

    // Audio Directive
    this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[alexaDevChatPodcasts.length - 1].audioURL, currentEpisode, null, offsetInMilliseconds);

    // Build reponse and send to Alexa
    this.emit(':responseReady');
  },

  'AMAZON.NextIntent': function() {
    // Get Audio Player Session Attributes
    var currentEpisode = this.attributes['currentEpisode'];
    var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];

    // If already on the last episode, just resume playing
    if (currentEpisode == alexaDevChatPodcasts.length) {
      // Speech Output
      this.response.speak(`Sorry, episode ${currentEpisode} is the latest episode. Resuming`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode - 1].audioURL, currentEpisode, null, offsetInMilliseconds);

      // Build reponse and send to Alexa
      this.emit(':responseReady');
    } else {
      currentEpisode++;

      // Speech Output
      this.response.speak(`Playing episode ${currentEpisode} of the Alexa Dev Chat podcast.`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode - 1].audioURL, currentEpisode, null, 0);

      // Build reponse and send to Alexa
      this.emit(':responseReady');
    }
  },

  'AMAZON.PreviousIntent': function() {
    // Get Audio Player Session Attributes
    var currentEpisode = this.attributes['currentEpisode'];
    var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];

    // If already on the first episode, just resume playing.
    if (currentEpisode == 1) {
      // Speech Output
      this.response.speak(`This is the first episode! Resuming`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode - 1].audioURL, currentEpisode, null, offsetInMilliseconds);

      // Build reponse and send to Alexa
      this.emit(':responseReady');
    } else {
      currentEpisode--;

      // Speech Output
      this.response.speak(`Playing episode ${currentEpisode} of the Alexa Dev Chat podcast.`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode - 1].audioURL, currentEpisode, null, 0);

      // Build reponse and send to Alexa
      this.emit(':responseReady');
    }
  },

  'AMAZON.RepeatIntent': function() {
    // Get Audio Player Session Attributes
    var currentEpisode = this.attributes['currentEpisode'];

    // Audio Directive
    this.response.audioPlayerPlay('REPLACE_ALL', alexaDevChatPodcasts[currentEpisode - 1].audioURL, currentEpisode, null, 0);

    // Build reponse and send to Alexa
    this.emit(':responseReady');
  },

  'AMAZON.StartOverIntent': function() {
    this.emitWithState(':AMAZON.RepeatIntent');
  },

  // Help Intent
  'AMAZON.HelpIntent': function() {
    var audioHelpMessage = "You are listening to the Alexa Dev Chat Podcast. You can say, next or previous to navigate through the podcasts. At any time, you can say pause to puase the audio or resume to resume.";
    this.emit(':ask', audioHelpMessage, audioHelpMessage);
  },

  // Audio Event Handlers - AudioPlayer Requests
  'PlaybackStarted': function() {
    this.attributes['currentEpisode'] = parseInt(this.event.request.token);
    this.attributes['offsetInMilliseconds'] = parseInt(this.event.request.offsetInMilliseconds);
    this.emit(':saveState', true);
  },

  'PlaybackFinished': function() {
    // Return to Main state
    this.handler.state = constants.states.MAIN;
    this.emit(':saveState', true);
  },

  'PlaybackStopped': function() {
    this.attributes['currentEpisode'] = parseInt(this.event.request.token);
    this.attributes['offsetInMilliseconds'] = parseInt(this.event.request.offsetInMilliseconds);
    this.emit(':saveState', true);
  },

  'PlaybackFailed': function() {
    console.log('Playback Failed: ', this.event.request.error);
    this.context.succeed(true);
  },

  // Unhandled Function - Handles Optional Audio Intents Gracefully
  'Unhandled': function() {
    this.emitWithState('AMAZON.HelpIntent');
  }
});

module.exports = audioPlayerHandlers;
