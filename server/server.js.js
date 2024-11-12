const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

app.use(cors())

const wordsList = [
	{
		word: 'bonjour',
		options: ['hello', 'goodbye', 'please', 'thank you'],
		correctAnswer: 'hello',
	},
	{
		word: 'merci',
		options: ['please', 'thank you', 'excuse me', 'good night'],
		correctAnswer: 'thank you',
	},
]

app.get('/api/question/:index', (req, res) => {
	const index = parseInt(req.params.index, 10)

	if (index >= 0 && index < wordsList.length) {
		const { word, options } = wordsList[index]
		res.json({ word, options })
	} else {
		res.status(404).json({ error: 'Question not found' })
	}
})

app.get('/api/questions', (req, res) => {
	res.json(wordsList.map(({ word, options }) => ({ word, options })))
})

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
