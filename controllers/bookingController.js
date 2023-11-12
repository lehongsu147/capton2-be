const moment = require('moment-timezone');
const bookingModel = require('../models/bookingModel')

const getHistoryBookingUser = async (req, res) => {
    try {
        const id = req.params.id;
        const listBooking = await bookingModel.getListBookingOfUserFromDb(id);

        if (listBooking !== null) {
            res.json({
                status: 200,
                data: listBooking
            });
        } else {
            res.status(400).json({
                status: 400,
                message: "Hệ thống lỗi hoặc không có booking cho User có ID này"
            });
        }

    } catch (error) {
        console.error(error);

        res.status(500).json({ error: 'Internal server error' });
    }
};

const getListRequestBooking = async (req, res) => {
    try {
        const id = req.params.id;
        const listBooking = await bookingModel.getRequestBookingOfPGTFromDb(id);

        if (listBooking !== null) {
            res.json({
                status: 200,
                data: listBooking
            });
        } else {
            res.status(400).json({
                status: 400,
                message: "Hệ thống lỗi hoặc không có booking cho User có ID này"
            });
        }

    } catch (error) {
        console.error(error);

        res.status(500).json({ error: 'Internal server error' });
    }
};
const getBookingListOfPgt = async (req, res) => {
    try {
        const id = req.params.id;
        const listBooking = await bookingModel.getListBookingFromDb(id);

        if (listBooking !== null) {
            res.json({
                status: 200,
                data: listBooking
            });
        } else {
            res.status(400).json({
                status: 400,
                message: "Hệ thống lỗi hoặc không có booking cho PGT có ID này"
            });
        }

    } catch (error) {
        console.error(error);

        res.status(500).json({ error: 'Internal server error' });
    }
};

///
const createBooking = async(req, res) => {
    const data = req.body;
    try {
        if (
            !data.hasOwnProperty('userId')
            || !data.hasOwnProperty('pgtId')
            || !data.hasOwnProperty('date')
            || !data.hasOwnProperty('timeStart') 
            || !data.hasOwnProperty('timeEnd') 
            // || !data.hasOwnProperty('category') 
        ) {
            return res.status(400).json({ error: 'userId, pgtId,timeStart,timeEnd là bắt buộc' });
        }

        if (!data.date || !Date.parse(data.date)) {
            return res.status(400).json({ error: 'Ngày không hợp lệ' });
        }

        if ( !data.timeStart || !Date.parse(data.timeStart || !data.timeStart || !Date.parse(data.timeStart  ) )) {
            return res.status(400).json({ error: 'Thời gian bắt dầu và kết thúc không hợp lệ' });
        }
        

        const formattedTimeStart = moment(data.timeStart).tz('Asia/Ho_Chi_Minh').format('HH:mm:ssZ');
        const formattedTimeEnd = moment(data.timeEnd).tz('Asia/Ho_Chi_Minh').format('HH:mm:ssZ');

        let date = moment(data.date).tz('Asia/Ho_Chi_Minh').format();
        const note = (data.note);
        const response = await bookingModel.signupBookingDB (
            data.userId,
            data.pgtId,
            parseInt(data?.price),
            date, 
            formattedTimeStart,
            formattedTimeEnd,
            data.category,
            note
        );
        res.json({
            status: response?.status,
            message: response.message,
            messsageError: response?.messsageError,
            data: response?.bookingId

        });

    } catch(error) {

        console.error(error);

        res.status(500).json({error: 'Internal server error'});

    }

};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.query;

        const response = await bookingModel.updateBookingToDB(id, type);
        if (response !== null) {
            res.json({
                status: response.status,
                message: response.message,
                data: response.bookingId
            });
        } else {
            res.status(400).json({
                status: 400,
                message: "Hệ thống lỗi hoặc không có booking cho PGT có ID này"
            });
        }

    } catch (error) {
        console.error(error);

        res.status(500).json({ error: 'Internal server error' });
    }
}

const getDetailBooking = async (req, res) => {
    try {
        const id = req.params.id;
        const bookingDetail = await bookingModel.getBookingDetail(id);

        if (bookingDetail !== null) {
            res.json({
                status: 200,
                data: bookingDetail
            });
        } else {
            res.status(400).json({
                status: 400,
                message: "Hệ thống lỗi hoặc không có booking có ID này"
            });
        }

    } catch (error) {
        console.error(error);

        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getBookingListOfPgt,
    getHistoryBookingUser,
    getListRequestBooking,
    postBooking: createBooking,
    updateBooking,
    getDetailBooking,
}