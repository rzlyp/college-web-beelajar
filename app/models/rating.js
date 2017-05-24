const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ratingSchema = new mongoose.Schema({
	id_user : String,
	email_user : String,
	rating : [{
		pengirim : { type: Schema.Types.ObjectId, ref: 'User' },
		rating : Number,
		review : String,
		time : { type : Date, default: Date.now }
	}]
});

const rating = mongoose.model('Rating',ratingSchema);

module.exports = rating;