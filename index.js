const express = require('express');
const session = require('express-session');
const passport = require('passport');
const PingStrategy = require('passport-ping-oauth2').Strategy;
const OAuth2Strategy = require('passport-ping-oauth2').Strategy;

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
    clientID: 'e8bf0d08-c70d-458e-b4b0-fe3922b6bdf2',
    clientSecret: 'N7PUniJUOTrSrCaf-P.9W2mcc-F1AacabY9HYG6FQfPUZT~.3H..SOgKoS8Km~Tp',
    callbackURL: 'http://localhost:3000/auth/ping/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Save user information if needed
    return done(null, profile);
  }
));

passport.use(new OAuth2Strategy({
    authorizationURL: 'URL_TO_AUTHORIZATION_ENDPOINT',
    tokenURL: 'URL_TO_TOKEN_ENDPOINT',
    clientID: 'e8bf0d08-c70d-458e-b4b0-fe3922b6bdf2',
    clientSecret: 'N7PUniJUOTrSrCaf-P.9W2mcc-F1AacabY9HYG6FQfPUZT~.3H..SOgKoS8Km~Tp',
    callbackURL: 'http://localhost:3000/auth/ping/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    // Verify user logic
    // This function will be called after successful authentication
    return cb(null, profile);
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
