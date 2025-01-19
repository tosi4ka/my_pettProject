const express = require('express')
const { getLevels } = require('../controllers/levelsController')

const router = express.Router()

router.get('/', getLevels)

module.exports = router
