var constants = Object.freeze({
  appId: '',
  dynamoDBTableName: 'VoiceDevsUsers',
  states: {
    ONBOARDING: '',
    MAIN: '_MAIN',
    AUDIO_PLAYER: '_AUDIO_PLAYER'
  }
});

module.exports = constants;
