// FIREBASE IMPORTS
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import admin from 'firebase-admin';
// project overview -> service accounts -> generate new private key -> add export default, make js file
import serviceAccount from './fire-steam-key.js';
// project settings -> scroll down -> your apps -> const firebaseConfig = {}
import firebaseConfig from './firebaseConfig.js';

// STEAM IMPORTS
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import passport_steam from 'passport-steam';
let SteamStrategy = passport_steam.Strategy;
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = getFirestore();

// initialize app
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});

// passport setup
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Initiate Strategy
passport.use(new SteamStrategy({
  returnURL: 'http://localhost:' + port + '/api/auth/steam/return',
  realm: 'http://localhost:' + port + '/',
  apiKey: process.env.API_KEY
}, function (identifier, profile, done) {
  process.nextTick(function () {
  profile.identifier = identifier;
  return done(null, profile);
  });
}
));
app.use(session({
  secret: 'Whatever_You_Want',
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 3600000
  }
}))
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  // res.send(req.user);
  res.status(200).send({token: req.session.token, steamid64: req.session.steamid64, credential: req.session.credential});
});
app.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
  res.redirect('/');
});

app.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
  let profile = req.user;
  let steamid64 = profile['_json']['steamid'];

  // generate token with steamid
  admin.auth().createCustomToken(steamid64).then(customToken => {
    req.session.steamid64 = steamid64;
    req.session.token = customToken;
    req.session.save();

    // sign in with token
    return signInWithCustomToken(auth, customToken).then(userCredential => {
      req.session.credential = userCredential;
      addDoc(collection(db, "users"), {steamid64: steamid64});
      req.session.save();
    });
  }).catch(err => {
    console.log(err);
  });
  res.redirect('/');
});