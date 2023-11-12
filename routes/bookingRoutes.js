const express = require('express')

const bookingController = require('../controllers/bookingController')

const router = express.Router()

// danh sách lịch sử  booking của 1 user 
router.get('/user/:id', bookingController.getHistoryBookingUser)
router.get('/pgt/:id', bookingController.getListRequestBooking)

// List  booking  của 1 pgt
router.post('/pgt/:id', bookingController.getBookingListOfPgt)

// Tạo booking
router.post('/', bookingController.postBooking)
// cập nhật booking
router.put('/:id', bookingController.updateBooking)
// chi tiết booking
router.get('/:id', bookingController.getDetailBooking)

module.exports = router