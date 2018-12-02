/*
Mongoose Schema which connects express with a MongoDB database.
@Author: Kevin Tran
@Class: Applied Internet Technology Fall 2018
*/

const mongoose = require('mongoose');
//automatically handles salting and hashing the password
const passportLocalMongoose = require('passport-local-mongoose');


const ExerciseSchema = new mongoose.Schema({
  name: String,
  reps: Number,
  sets: Number,
  weight: Number,
  rpe: Number,
  date: {
    type: Date,
    default: Date.now //activates when date field is undefined
  },
});

const UserSchema = new mongoose.Schema({

  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: String,
  weight: Number,
  height: Number,
  goalWeight: Number,
  level: Number,
  exercises: [ExerciseSchema] //embedded document
});




//passport integration
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
const Exercise = mongoose.model('Exercise', ExerciseSchema);


// is the environment variable, NODE_ENV, set to PRODUCTION?
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
  // if we're in PRODUCTION mode, then read the configration from a file
  // use blocking file io to do this...
  const fs = require('fs');
  const path = require('path');
  const fn = path.join(__dirname, 'config.json');
  const data = fs.readFileSync(fn);

  // our configuration file will be in json, so parse it and set the
  // conenction string appropriately!
  const conf = JSON.parse(data);
  dbconf = conf.dbconf;
} else {
  // if we're not in PRODUCTION mode, then use
  dbconf = 'mongodb://localhost/musclestory';
}

//password is password for MongoDB from part 3
mongoose.connect(dbconf, { useNewUrlParser: true });
