module.exports = (app) => {
  // Logout user.
  app.get('/test/addstreamer', (req, res) => {
    // Trying to dynamically add a user to listen to twitch webhooks
    // take in users name/id and listen to webhook for that users
    // stream changes and followers
    console.log({ req });
  });
};
