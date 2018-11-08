const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appSchema = new Schema({
	user:[{
		name: String,
		weight: Double,
		height: Double,
		avatar: {
				level: Number,
				 	}	}]
	exercise: [{name: String, reps: Double, sets: Double, weight: Double, part: String, rpe: Double, date: {type: Date, default: Date.now},		type: String}]
});
