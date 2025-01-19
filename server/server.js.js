const express = require('express')
const cors = require('cors')
const mongoose = require('./db')

const levelsRoutes = require('./routes/levels')
const complexitiesRoutes = require('./routes/complexities')
const questionsRoutes = require('./routes/questions')
const answersRoutes = require('./routes/answers')

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

app.use('/api/levels', levelsRoutes)
app.use('/api/complexities', complexitiesRoutes)
app.use('/api/questions', questionsRoutes)
app.use('/api/answers', answersRoutes)

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
