var alexaMeetups = require('../data/alexaMeetups');

// Returns the meetup object if the city matches
module.exports = function checkMeetupCity(USCitySlot, EuropeanCitySlot) {
  // Check which city we actually have
  var city = '';
  if (USCitySlot) {
    city = USCitySlot;
  } else if (EuropeanCitySlot) {
    city = EuropeanCitySlot;
  }

  // Check whether city has a meetup
  var cityMatch;
  for (var i = 0; i < alexaMeetups.length; i++) {
    if (city.toLowerCase() === alexaMeetups[i].city.toLowerCase()) {
      cityMatch = alexaMeetups[i];
    }
  }

  return cityMatch;
};
