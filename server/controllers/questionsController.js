const Question = require('../models/Question')

exports.getQuestions = async (req, res) => {
	try {
		const { level, complexity } = req.query

		if (level.toLowerCase() !== 'beginner') {
			return res.status(400).json({ error: 'Only Beginner level is supported' })
		}

		if (!complexity || complexity < 1 || complexity > 5) {
			return res
				.status(400)
				.json({
					error: 'Complexity must be between 1 and 5 for Beginner level',
				})
		}

		const questions = await Question.aggregate([
			{ $match: { level, complexity: parseInt(complexity) } },
			{ $sample: { size: 10 } },
		])

		if (!questions.length) {
			return res.status(404).json({ error: 'No questions found' })
		}

		res.json(questions)
	} catch (err) {
		res.status(500).json({ error: 'Internal server error' })
	}
}
