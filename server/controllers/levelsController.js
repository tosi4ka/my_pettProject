const Question = require('../models/Question')

async function getLevels(req, res) {
	try {
		const levels = await Question.distinct('level')
		const beginnerLevels = levels.filter(
			level => level.toLowerCase() === 'beginner'
		)
		res.json(beginnerLevels)
	} catch (err) {
		res.status(500).json({ error: 'Internal server error' })
	}
}

module.exports = { getLevels }
