const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Question = require('./models/Question')

const app = express()
const port = 3001

mongoose.connect('mongodb://localhost:27017/quiz', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

app.use(cors())

app.get('/api/questions', async (req, res) => {
	const { level, complexity } = req.query

	try {
		const questions = await Question.find({
			level: level,
			complexity: parseInt(complexity),
		})

		if (questions.length === 0) {
			return res.status(404).json({ error: 'No questions found' })
		}

		res.json(questions)
	} catch (err) {
		res.status(500).json({ error: 'Internal server error' })
	}
})

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
