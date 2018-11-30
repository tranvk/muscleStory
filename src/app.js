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



//custom passport strategy implementing bcrypt to encrypt password
passport.use(new LocalStrategy(

  function(username, password, done) {
    User.findOne({
        username: username
      }, function(err, user) {

        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "Incorrect username."
          });
        }
        if (user) {
          bcrypt.compare(password, user.password, function(err, res)) {
            if (err) {
              return done(err);
            }
            if (res === false) {

              return done(null, false);

            } else {
              return done(null, user);
            }
          }
        }




      }

    });
));






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


//registration form
//user is automatically logged in after registration
app.post('/register', (req, res) => {

  //hash the password from request body

  //12 salt rounds for high security
  bcrypt.hash(req.body.password, 12, function(err, hash){

    User.register(new User({
      username: req.body.username
    }), hash, function(err, user) {

      if (err) { //if there's a problem, render the register page again
        return res.render('register', {
          user: user
        });
      }

      //authenticate using local strategy
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    });

  })




});


//
app.get('/login', (req, res) => {

  res.render('login', {
    user: req.user
  }); //req.user contains the authenticated user
});



app.post('/login', passport.authenticate('local'), (req, res) => {


  res.redirect('/');


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
    date: req.body.date
  });

  user.save(function(err) {

    if (!err) console.log("Success");

  });

  //---------------------------------------------------------------------------//


});


//Route to progress page that shows all recorded workouts
app.get('/progress', (req, res) => {

  Exercise.find(function(err, exercises, count) {
    console.log(exercises);
    res.render('progress', {
      exercises: exercises

    });
  });


});


//logout method passed to req object from passport
//removes req.user property and clears login session
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.listen(process.env.PORT || 3000);
