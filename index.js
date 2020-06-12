const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const app = express();
const PORT = 3000 || process.env.PORT;

const { MONGO_URI, SESSION_SECRET } = require('./config/keys');

// Connect MongoDB with Mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { connection } = mongoose;
connection.once('open', () =>
  console.log('MongoDB database connection established successfully')
);

app.use('/public', express.static('public'));

app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./services/passport/streamlabs');

// Basic Express Routes
app.get('/', (req, res) =>
  res.send(
    '<div><div>Hello World!</div><a href="/auth/streamlabs/authorize">Streamlabs Login</a></div>'
  )
);

app.get(
  '/protected-route',
  function (req, res, next) {
    if (req.isAuthenticated()) return next();

    // Not authenticated.
    res.redirect('/auth/streamlabs/authorize');
  },
  function (req, res) {
    // Good to go.
    res.sendFile('./public/index.html', { root: __dirname });
  }
);

// Passport Routes
require('./routes/auth')(app);

// Production for Heroku (When Deploying)
// if (process.env.NODE_ENV === 'production') {
//   const path = require('path');
//   app.use(express.static('client/build'));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

// Express Server Start
app.listen(PORT, () => console.log(`Streamlytics listening on port ${PORT}!`));
