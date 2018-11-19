const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({

  name: String,
  weight: Number,
  height: Number,
  avatar: {
    level: Number,
  },

  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise"
  }]

});

const ExerciseSchema = new mongoose.Schema({
  name: String,
  reps: Number,
  sets: Number,
  weight: Number,
  rpe: Number,
  date: {
    type: Date,
    default: Date.now
  },
});


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
 dbconf = 'mongodb://localhost/YOUR_DATABASE_NAME_HERE';
}

//password is password for MongoDB from part 3
mongoose.connect('dbconf');
