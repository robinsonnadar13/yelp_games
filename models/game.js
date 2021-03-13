const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
	title: String,
	description: String,
	developer: String,
	publisher: String,
	date: Date,
	engine: String,
	platform: String,
	genre: String,
	color: Boolean,
	image: String,
	owner: {
		id: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

gameSchema.index({
	'$**': 'text'
})

module.exports = mongoose.model("game",gameSchema);