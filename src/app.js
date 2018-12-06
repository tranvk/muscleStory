/*
Express server routing for the MuscleStory webapp, a fitness tracking game.
@Author: Kevin Tran
@Class: Applied Internet Technology Fall 2018
*/

require('./db');

const express = require('express');

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
const validate = require('validate.js');


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


//set SESSION_SECRET directly on host server
app.use(session({
  secret: process.env.SESSION_SECRET
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

//public static file access
app.use(express.static(path.join(__dirname, 'public')));


//validate.js: setup global constraints to be used by validate function in app.post form handler
const constraints = {
  rpe: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      lessThanOrEqualTo: 10,
    }
  },
  reps: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
    }
  },
  sets: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
    }
  },
  weight: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
    }
  }
};


//custom passport strategy implementing bcrypt to encrypt password
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//GET home page with information about app
app.get('/', (req, res) => {


  res.render('index', {
    user: req.user
  });



});


//GET Registration page
app.get('/register', (req, res) => {
  res.render('register', {});
});


//registration form: storing name and hashed password and redirecting to home page after signup
//user is automatically logged in after registration
app.post('/register', (req, res) => {

  //use sync version of bcrypt due to problems with implementing async version
  //drawback: will block event loop due to CPU intensivity
  const hash = bcrypt.hashSync(req.body.password, saltRounds);


  //Create new user and pass in username and hashed password
  User.register(new User({
      username: req.body.username,
      password: req.body.password
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        console.log(user);
        res.render('register', {
          message: 'Your registration information is not valid'
        });
      }

      else {


        passport.authenticate('local')(req, res, function() {
          console.log("")
          res.redirect('/');
        });
      }
    });
});


//GET the login form
app.get('/login', (req, res) => {

  //req.user contains the authenticated user
  res.render('login', {
    user: req.user
  });
});

//from passport slides
//authenticate and use req.login to start logged in session
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (user) {
      req.logIn(user, function(err) {
        if (!err) {
          res.redirect('/');
        }
      });
    } else {
      res.render('login', {
        message: 'Your username or password is incorrect.'
      });
    }
  })(req, res, next);
});



//render workout form page
app.get('/add', (req, res) => {


  res.render('addWorkout');


});

//Add to list of workouts stored as property in User object
app.post('/add', (req, res) => {


  const user = req.user;

  //validate properties of user.exercises using previously defined constraints
  //if there are no errors nothing is returned.
  const validateObject = validate({
    reps: req.body.reps,
    sets: req.body.sets,
    weight: req.body.weight,
    rpe: req.body.rpe
  }, constraints);


  //redirect to home page if there is an invalid entry in the form, and prevent it from being added to user
  if (typeof validateObject !== "undefined") {

    console.log(validateObject);
    res.redirect(301, '/');

  } else {


    //push object containing exercise details into array property 'exercises' of user
    user.exercises.push({
      name: req.body.name,
      reps: req.body.reps,
      sets: req.body.sets,
      weight: req.body.weight,
      rpe: req.body.rpe,
      date: req.body.date,
    });
    user.level = user.exercises.length; //set level based on number of workouts completed

    user.save(function(err) {

      if (!err) {
        res.redirect(301, '/progress');
      }
    });

    //---------------------------------------------------------------------------//
  }

});


//Route to progress page that shows all recorded workouts
app.get('/progress', (req, res) => {

  const user = req.user; //access passport user object
  if(user === undefined){
    res.redirect('/login');
  }
  if (user.exercises.length == 0 || user.exercises === undefined){
    res.redirect('/add');
  }
  else{
    const experience = user.exercises.length * 75; //show experience bar in proportion to length of workouts completed
    const level = user.level; //user level based on length of exercises array
    let img = "";

    //load avatar based on character level
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


    //use Array.reduce to calculate total volume lifted



    const exerciseArray = user.exercises;

    const totalReps = exerciseArray.reduce((a, b) => ({
      reps: a.reps + b.reps
    }));
    const totalSets = exerciseArray.reduce((a, b) => ({
      sets: a.sets + b.sets
    }));
    const totalWeight = exerciseArray.reduce((a, b) => ({
      weight: a.weight + b.weight
    }));

    const totalVolume = (totalReps['reps'] * totalSets['sets'] * totalWeight['weight']);



    //calculate total and average RPE
    const totalRPE = exerciseArray.reduce((a, b) => ({
      rpe: a.rpe + b.rpe
    }));
    const averageRPE = (totalRPE['rpe'] / exerciseArray.length);



    //calculate body mass index
    const bmi = (703 * (user.weight / (Math.pow(user.height, 2))));

    const difference = Math.abs(user.weight - user.goalWeight);

    const dailyCals = Math.floor((3500*difference)/30);


    //render progress.hbs with various template variables
    res.render('progress', {
      user: user,
      exercises: user.exercises,
      experience: experience,
      level: level,
      icon: img,
      totalVolume: totalVolume,
      averageRPE: averageRPE,
      height: user.height,
      weight: user.weight,
      goalWeight: user.goalWeight,
      bmi: bmi,
      difference: difference,
      dailyCals: dailyCals
    });
  }



});

//GET request to details form
app.get('/details', (req, res) => {

  res.render('userDetails');

});

app.post('/details', (req, res) => {


  //set user.height and user.weight to the values submitted in form
  User.updateOne({
    username: req.user.username
  }, {
    $set: {
      "height": req.body.height,
      "weight": req.body.weight,
      "goalWeight": req.body.goalWeight
    }
  }, function(err, user) {
    if (err) {
      throw err;
    }
    console.log(user);

  });


  res.redirect(301, "/progress");

});

//logout method passed to req object from passport
//removes req.user property and clears login session
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.listen(process.env.PORT || 3000);
