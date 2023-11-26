const { getPaymentInDB, updatePayment, getPaymentListForUserInDB } = require("../models/paymentModel");

const getPaymentDetail = async (req, res, next) => {
    try {
        const id = req.params.id;
        const paymentDetail = await getPaymentInDB(id);

        if (paymentDetail !== null) {
            res.json({
                status: 200,
                data: paymentDetail?.data
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
}
const getPaymentListForUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const paymentDetail = await getPaymentListForUserInDB(id);
        if (paymentDetail !== null) {
            res.json({
                status: 200,
                data: paymentDetail.data
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
}

const updatePayMentStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const  { status,txtNo}= req.body;
        const paymentDetail = await updatePayment(id,status,txtNo);
        if (paymentDetail?.status === 200 ){
            res.json({
                status: 200,
                data: paymentDetail?.data
            });
        } else {
            res.status(400).json({
                status: 400,
                message: "Hệ thống lỗi"
            });
        }

    } catch (error) {
        console.error(error);

        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = {
    getPaymentDetail,
    getPaymentListForUser,
    updatePayMentStatus,
}