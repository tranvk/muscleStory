const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appSchema = new Schema({
	user: {
		name: String,
		weight: Double,
		height: Double,
		avatar: {
				level: Number,
					}	}
	exercise: String,
	reps: Double,
	sets: Double,
	weight: Double,
	rpe: Double,
	date: {type: Date, default: Date.now},
});
