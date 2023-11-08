const express = require('express')

const pgtController = require('../controllers/pgtController')

const router = express.Router()

router.get('/', pgtController.getPgtList)

module.exports = router