const passport = require('passport');
const path = require('path');

module.exports = (app) => {
  // Passport Routes
  // Set route to start OAuth link, this is where you define scopes to request
  // Routes
  app.get('/auth/streamlabs/authorize', passport.authenticate('streamlabs'));
  app.get(
    '/auth/streamlabs/callback',
    passport.authenticate('streamlabs', {
      failureRedirect: '/auth/streamlabs/authorize',
    }),
    function (req, res) {
      // console.log('logged in', req.user.token);
      res.redirect('/');

      // At this point, the authentication was successful.
    }
  );

  app.get('/logout', function (req, res) {
    req.logout();

    res.redirect('/');
  });
};
