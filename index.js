var express = require('express');
var http = require('http');
var cors = require('cors');
var mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');

// const { StreamlabsClient } = require('streamlabs-ws-client'); // Only does TWITCH

const app = express();
app.use(cors());

var server = http.createServer(app);
// Pass a http.Server instance to the listen method
var io = require('socket.io');
io = io.listen(server);

// The server should start listening
server.listen(5000);

const {
  MONGO_URI,
  SESSION_SECRET,
  STREAMLABS_SOCKET,
} = require('./config/keys');

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
// app.listen(PORT, () => console.log(`Streamlytics listening on port ${PORT}!`));

/* ********************************************************** */
/*                 Socket logic starts here										*/
/* ********************************************************** */
let socketID;
let streamlabs;
io.use(function (socket, next) {
  // console.log('Query: ', socket.handshake.query);
  // return the result of next() to accept the connection.
  console.log(socket.handshake.query.slkey);
  if (socket.handshake.query.slkey) {
    socket.streamlabsKey = socket.handshake.query.slkey;
    return next();
  }
  // call next() with an Error if you need to reject the connection.
  next(new Error('Authentication error'));
});

io.on('connection', (socket) => {
  // console.log(socket.request);
  console.log('Connected user...', socket.streamlabsKey);
  socketID = socket.client.id;

  // Connect to streamlabs socket
  const ioClient = require('socket.io-client');
  streamlabs = ioClient(
    `https://sockets.streamlabs.com?token=${socket.streamlabsKey}`,
    {
      transports: ['websocket'],
    }
  );
  streamlabs.on('event', (eventData) => {
    if (!eventData.for && eventData.type === 'donation') {
      //code to handle donation events
      console.log(eventData.message);
    }
    if (eventData.for === 'twitch_account') {
      switch (eventData.type) {
        case 'follow':
          //code to handle follow events
          console.log(eventData.message);
          break;
        case 'subscription':
          //code to handle subscription events
          console.log(eventData.message);
          break;
        default:
          //default case
          console.log(eventData.message);
      }
    }
  });

  // show disconnecting socketid
  socket.on('disconnect', () => {
    console.log('disconnect user...', socketID);
    streamlabs.disconnect(true);
  });
});
