const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

app.use(cors())

const wordsList = [
	{
		word: 'bonjour',
		options: ['hello', 'thank you', 'goodbye', 'please'],
		correctAnswer: 'hello',
	},
	{
		word: 'merci',
		options: ['please', 'thank you', 'excuse me', 'good night'],
		correctAnswer: 'thank you',
	},
	{
		word: 'raconter',
		options: ['to tell', 'gracias', 'merci', 'dormir'],
		correctAnswer: 'to tell',
	},
	{
		word: 'lire',
		options: ['to read', 'leer', 'lire', 'читать'],
		correctAnswer: 'to read',
	},
	{
		word: 'aller',
		options: ['to go', 'ir', 'aller', 'идти'],
		correctAnswer: 'to go',
	},
	{
		word: 'être',
		options: ['to be', 'ser', 'être', 'быть'],
		correctAnswer: 'to be',
	},
	{
		word: 'avoir',
		options: ['to have', 'tener', 'avoir', 'иметь'],
		correctAnswer: 'to have',
	},
	{
		word: 'dormi',
		options: ['slept', 'dormido', 'dormi', 'спал'],
		correctAnswer: 'slept',
	},
	{
		word: "j'arrive",
		options: ["I'm coming", 'yo llego', "j'arrive", 'я иду'],
		correctAnswer: "I'm coming",
	},
	{
		word: 'bouteille',
		options: ['bottle', 'botella', 'бутылка', 'bouteille'],
		correctAnswer: 'bottle',
	},
]

// Маршрут для получения одного вопроса с правильным ответом
app.get('/api/question/:index', (req, res) => {
	const index = parseInt(req.params.index, 10)

	if (index >= 0 && index < wordsList.length) {
		const { word, options, correctAnswer } = wordsList[index]
		res.json({ word, options, correctAnswer }) // Теперь возвращаем correctAnswer
	} else {
		res.status(404).json({ error: 'Question not found' })
	}
})

// Маршрут для получения всех вопросов с правильными ответами
app.get('/api/questions', (req, res) => {
	res.json(wordsList) // Возвращаем весь объект, включая correctAnswer
})

// Запуск сервера
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
