const express = require('express')

const pgtController = require('../controllers/pgtController')

const router = express.Router()

router.get('/', pgtController.getPgtList)
router.get('/feedback/:id', pgtController.getPgtFeedbackList)
router.get('/:id', pgtController.getPgtDetail)

// change to role pgt
router.post("/:id", pgtController.requestToPgt);

// update request booking
router.put("/:id", pgtController.acceptInfoRequestBooking);

module.exports = router