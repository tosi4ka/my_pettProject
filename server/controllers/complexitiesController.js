const Question = require('../models/Question')

async function getComplexities(req, res) {
	const { level } = req.body

	if (!level || typeof level !== 'string') {
		return res
			.status(400)
			.json({ error: 'Level is required and must be a string' })
	}

	try {
		const complexities = await Question.find({ level }).distinct('complexity')
		const filteredComplexities = complexities.filter(c => c >= 1 && c <= 5)
		res.json(filteredComplexities)
	} catch (err) {
		res.status(500).json({ error: 'Internal server error' })
	}
}

module.exports = { getComplexities }
