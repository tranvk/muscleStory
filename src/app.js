require('./db');

const express = require('express');
require('dotenv').config()

const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = mongoose.model('User');
const Exercise = mongoose.model('Exercise');
const session = require('express-session');
const path = require('path');
const app = express();
const LocalStrategy = require('passport-local').Strategy;


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


app.use(session({
  secret: "1234"
}));


//bodyparser to access req.body fields
app.use(bodyParser.urlencoded({
  extended: true
}));

//send session ID over cookies to the client

//initialize passport
app.use(passport.initialize());




//middleware to alter the req object and change the user value found in session id from client cookie into the true deserialized user Object
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));








//custom passport strategy implementing bcrypt to encrypt password
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//home page is login page
app.get('/', (req, res) => {


  res.render('index', {
    user: req.user
  });



});



app.get('/register', (req, res) => {
  res.render('register', {});
});


//registration form: storing name and hashed password and redirecting to home page after signup
//user is automatically logged in after registration
app.post('/register', (req, res) => {

  User.register(new User({
      username: req.body.username,
      password: req.body.password
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        res.render('register', {
          message: 'Your registration information is not valid'
        });
      } else {

        passport.authenticate('local')(req, res, function() {
          res.redirect('/');
        });
      }
    });


});


//
app.get('/login', (req, res) => {

  res.render('login', {
    user: req.user
  }); //req.user contains the authenticated user
});

//from passport slides
//authenticate and use req.login to start logged in session
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (user) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.render('login', {
        message: 'Your login or password is incorrect.'
      });
    }
  })(req, res, next);
});



//render workout form page
app.get('/add', (req, res) => {


  res.render('addWorkout')

});

//Add to list of workouts stored as property in User object
app.post('/add', (req, res) => {

  var user = req.user;

  user.exercises.push({
    name: req.body.name,
    reps: req.body.reps,
    sets: req.body.sets,
    weight: req.body.weight,
    rpe: req.body.rpe,
    date: req.body.date,
  });
  user.level = user.exercises.length;

  user.save(function(err) {

    if (!err) {
      res.redirect('/progress');
    }
  });

  //---------------------------------------------------------------------------//


});


//Route to progress page that shows all recorded workouts
app.get('/progress', (req, res) => {

  let user = req.user;
  let experience = user.exercises.length * 75; //show experience bar in proportion to length of workouts completed
  let level = user.level;
  let img = "";
  switch (level) {
    case 0:
      img = "images/slime.jpg";
      break;
    case 1:
      img = "images/pig.jpg";
      break;
    case 2:
      img = "images/mushroom.jpg";
      break;
    case 3:
      img = "images/bluemushroom.png";
      break;
    case 4:
      img = "images/stump.png";
      break;
    case 5:
      img = "images/yeti.png";
      break;
    case 6:
      img = "images/balrog.png";
      break;
    case 7:
      img = "images/beginner.gif";
      break;
    case 8:
      img = "images/warrior.png";
      break;
    case 9:
      img = "images/knight.png";
      break;
    case 10:
      img = "images/maxWarrior.png";
      break;
  }

  res.render('progress', {
    exercises: user.exercises,
    experience: experience,
    level: level,
    icon: img
  });



});


//logout method passed to req object from passport
//removes req.user property and clears login session
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.listen(process.env.PORT || 3000);
