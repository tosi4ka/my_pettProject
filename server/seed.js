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

		await Question.insertMany(seedQuestions)
		console.log('Database seeded successfully!')
	} catch (err) {
		console.error('Error while seeding database:', err)
	} finally {
		mongoose.connection.close()
	}
}

seedDB()
