require('./db');

const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = mongoose.model('User');
const Exercise = mongoose.model('Exercise');
const session = require('express-session');
const path = require('path');
const auth = require('auth');

const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//logger to log out errors
app.use(express.logger());

//bodyparser to access req.body fields
app.use(express.bodyParser());

//send session ID over cookies to the client
app.use(express.session());

//initialize passport
app.use(passport.initialize());

//middleware to alter the req object and change the user value found in session id from client cookie into the true deserialized user Object
app.use(passport.session());

app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json());

app.use(express.urlencoded({
  extended: false
}));

//home page is login page
app.get('/', (req, res) => {


  res.render('index', {user: req.user});



});

app.get('/register', (req, res) => {
  res.render('register', {});
});


app.post('/register', (req, res) => {

  User.register(new User({
    username: req.body.username
  }), req.body.password, function(err, user) {

    if (err) { //if there's a program, render the register page again
      return res.render('register', {
        user: user
      });
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
  //-----------------------------------------------------------------------------------------------//

  //error callback with various error messages
  const errorCallback = function(message) {
    res.render('register', message);
  };

  //only called if registration works
  const successCallback = function(user) {
    //assuming new user exists'
    auth.startAuthenticatedSession(req, user, (err) => {
      if (err) {
        res.redirect('/'); //redirect to home page
      }
    });

  };

  //call auth's register function with callbacks defined above
  auth.register(req.body.username, req.body.email, req.body.password, errorCallback, successCallback);

});



app.get('/login', (req, res) => {

  res.render('login', {
    user: req.user
  }); //req.user contains the authenticated user
});

app.post('/login', passport.authenticate('local'), (req, res) => {


  res.redirect('/');
  /*
  //if login doesn't work, re-render login template with error
  const errorCallback = function(message) {
    res.render("login", messsage);

  };

  // if login works
  const successCallback = function(user) {
    auth.startAuthenticatedSession(req, user, function(err) {
      if (err) {
        res.redirect('/');
      }

    });
  };

  //call auth's login function with callbacks defined above
  auth.login(req.body.username, req.body.password, errorCallback, successCallback);
  */

});





app.get('/add', (req, res) => {


  res.render('list')

});


app.post('/add', (req, res) => {

  var user = req.user;

  user.exercises.push({
    name: req.body.name,
    reps: req.body.reps,
    sets: req.body.sets,
    weight: req.body.weight,
    rpe: req.body.rpe,
    date: req.body.date
  });

  user.save(function(err) {

    if (!err) console.log("Success");

  });

//---------------------------------------------------------------------------//

  new Exercise({
    name: req.body.name,
    reps: req.body.reps,
    sets: req.body.sets,
    weight: req.body.weight,
    rpe: req.body.rpe,
    date: req.body.date
  }).save(function(err, exercises) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');

    }
  });

});


app.get('/progress', (req, res) => {

  Exercise.find(function(err, exercises, count) {
    console.log(exercises);
    res.render('progress', {
      exercises: exercises

    });
  });


});


app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.listen(process.env.PORT || 3000);
