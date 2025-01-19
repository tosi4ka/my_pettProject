const express = require('express')
const router = express.Router()
const { getQuestions } = require('../controllers/questionsController')

router.get('/', getQuestions)

module.exports = router
