const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
	level: { type: String, required: true },
	complexity: { type: Number, required: true },
	word: { type: String, required: true },
	options: { type: [String], required: true },
	correctAnswer: { type: String, required: true },
	type: {
		type: String,
		required: true,
		enum: ['translation', 'fill-in-the-blank'],
	},
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question
