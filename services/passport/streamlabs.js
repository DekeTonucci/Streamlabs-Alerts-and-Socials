const passport = require('passport');
const request = require('request');
const StreamlabsStrategy = require('passport-streamlabs').Strategy;
const {
  STREAMLABS_CLIENT_ID,
  STREAMLABS_CALLBACK_URL,
  STREAMLABS_CLIENT_SECRET,
} = require('../../config/keys');
const User = require('../../models/User');

passport.use(
  new StreamlabsStrategy(
    {
      clientID: STREAMLABS_CLIENT_ID,
      clientSecret: STREAMLABS_CLIENT_SECRET,
      // https://dev.streamlabs.com/docs/scopes
      scope: [
        'donations.read',
        // 'donations.create',
        'socket.token',
        //'points.read',
        //'points.write',
        //'alerts.create',
        //'credits.write',
        //'profiles.write',
        //'jar.write',
        //'wheel.write'
      ],
      callbackURL: STREAMLABS_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log({ profile });

      const existingUser = await User.findOne({ streamLabsId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      // Get Socket Token for Streamlabs Alert Access
      let options = {
        method: 'GET',
        url: 'https://streamlabs.com/api/v1.0/socket/token',
        qs: { access_token: accessToken },
      };
      let newUser;
      try {
        await request(options, async function (error, response, body) {
          if (error) return rej(error);

          body = JSON.parse(body);
          newUser = await new User({
            streamLabsId: profile.id,
            display_name: profile.display_name,
            tokens: {
              accessToken,
              refreshToken,
              socketToken: body.socket_token,
            },
          }).save();
        });
      } catch (error) {
        console.log({ error });
      }
      await newUser.save();
      return done(undefined, newUser);
    }
  )
);

// User serialization
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
