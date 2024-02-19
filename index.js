const express = require('express');
const session = require('express-session');
const passport = require('passport');
const PingStrategy = require('passport-ping-oauth').Strategy;

const app = express();

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define Ping OAuth Strategy
passport.use(new PingStrategy({
    clientID: 'y0fc4ee82-36f0-4626-93b9-587f4a7981a9',
    clientSecret: 'HE.y3JPKSbXOs4YwEvCDxj~kt8yJQEEr3T8T84VIgU6II5LZ37i8s9ytf9dVTmUx',
    callbackURL: 'http://localhost:3000/auth/ping/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Save user information if needed
    return done(null, profile);
  }
));

// Serialize user into session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Define routes
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1><a href="/auth/ping">Login with Ping</a>');
  res.render('index', { user: req.user });

});

app.get('/auth/ping', passport.authenticate('ping'));

app.get('/auth/ping/callback',
  passport.authenticate('ping', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
