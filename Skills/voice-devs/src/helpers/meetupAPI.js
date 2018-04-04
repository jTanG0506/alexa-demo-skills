var request = require('request-promise');

module.exports = {
  GetUserDetails: (accessToken) => {
    return new Promise((resolve, reject) => {
      // Call Meetup API
      request({
        url: "https://api.meetup.com/2/member/self/?access_token=" + accessToken,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        // Return users details
        resolve(JSON.parse(response));
      }).catch((error) => {
        // API error
        reject('Meetup API Error: ', error);
      })
    });
  }
}
