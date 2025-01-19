const express = require('express')
const { getComplexities } = require('../controllers/complexitiesController')

const router = express.Router()

router.post('/', getComplexities)

module.exports = router
