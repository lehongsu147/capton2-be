const express = require('express')

const pgtController = require('../controllers/pgtController')

const router = express.Router()
// lấy danh sách pgt
router.get('/', pgtController.getPgtList)
// danh sahcs bình luận
router.get('/feedback/:id', pgtController.getPgtFeedbackList)
//  lấy thông tin pgt  
router.get('/:id', pgtController.getPgtDetail)
// change to role pgt
router.post("/:id", pgtController.requestToPgt);
// update request booking
router.put("/:id", pgtController.acceptInfoRequestBooking);

module.exports = router