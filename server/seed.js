const mongoose = require('mongoose')
const Question = require('./models/Question')
const seedQuestions = require('./data/questions')

mongoose.connect('mongodb://localhost:27017/quiz', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

async function seedDB() {
	try {
		console.log('Seeding database...')

		await Question.deleteMany({})

		const validatedQuestions = seedQuestions.map((question, index) => {
			if (!question.type) {
				throw new Error(
					`Missing "type" field in question at index ${index}: ${JSON.stringify(
						question
					)}`
				)
			}

			if (!question.level || typeof question.level !== 'string') {
				throw new Error(
					`Invalid or missing "level" in question at index ${index}: ${JSON.stringify(
						question
					)}`
				)
			}

			if (typeof question.complexity !== 'number') {
				console.warn(
					`Complexity is not a number for question at index ${index}. Converting to number.`
				)
				question.complexity = parseInt(question.complexity, 10)
			}

			if (question.complexity < 1 || question.complexity > 5) {
				throw new Error(
					`Invalid complexity value in question at index ${index}: ${JSON.stringify(
						question
					)}`
				)
			}

			return question
		})

		console.log('Validated Questions:', validatedQuestions)

		await Question.insertMany(validatedQuestions)
		console.log('Database seeded successfully!')
	} catch (err) {
		console.error('Error while seeding database:', err)
	} finally {
		mongoose.connection.close()
	}
}

seedDB()
