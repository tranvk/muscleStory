require('./db');

const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = mongoose.model('User');
const Exercise = mongoose.model('Exercise');
const session = require('express-session');
const path = require('path');

const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

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


  res.render('login');



});
app.get('/add', (req, res) => {


  res.render('list')

});

app.post('/add', (req, res) => {


  new Exercise({
    exercise: req.body.name,
    reps: req.body.reps,
    sets: req.body.sets,
    weight: req.body.weight,
    rpe: req.body.rpe,
    date: req.body.date
  }).save(function(err, exercises) {
		if (err){
			console.log(err);
		}
		else{
			res.redirect('/');

		}
  });

});


app.get('/progress', (req, res) => {

  Exercise.find(function(err, exercises, count) {
    res.render('progress', {
      exercises: exercises

    });
  });


});


app.listen(process.env.PORT||3000);
