const client = require('../db');

const paymentCreate = async (vnp_TxnRef, amount, vnp_OrderInfo, pgtId, user_id, bookingId) => {
    try {
        const res = await client.query(`
        INSERT INTO public.payment(
            txn_ref, amount, description, pgt_id, user_id,booking_id)
            VALUES ($1, $2, $3, $4, $5,$6)
        `, [vnp_TxnRef, amount, vnp_OrderInfo, pgtId, user_id, bookingId]);
        if (res.rows.length > 0) {
            return {
                status: 200,
                message: "Tạo thành công.",
                bookingId: res.rows[0]
            };
        } else {
            return {
                status: 400,
                message: "Hệ thống lỗi",
            };
        }
    } catch (error) {
        // Xử lý lỗi truy vấn
        console.error(error);
        throw error;
    }
}
const getPaymentInDB = async (id) => {
    try {
        const res = await client.query(`
            SELECT
            payment.id,
            payment.date,
            payment.booking_id,
            payment.description,
            payment.user_id,
            user_table.user_name AS user_name,
            pgt_user.user_name AS pgt_name,
            payment.pgt_id
        FROM
            public.payment
        JOIN
            public."user" AS user_table ON payment.user_id = user_table.id
        JOIN
            public."user" AS pgt_user ON payment.pgt_id = pgt_user.id
            Where txn_ref = $1
        `, [id]);
        if (res.rows.length > 0) {
            return {
                status: 200,
                data: res.rows[0]
            };
        } else {
            return {
                status: 400,
                message: "Hệ thống lỗi",
            };
        }
    } catch (error) {
        // Xử lý lỗi truy vấn
        console.error(error);
        throw error;
    }
}
const getPaymentListForUserInDB = async (id) => {
    try {
        const res = await client.query(`
        SELECT * FROM public.payment
        Where user_id = $1
        `, [id]);
        if (res.rows.length > 0) {
            return {
                status: 200,
                data: res.rows
            };
        } else {
            return {
                status: 400,
                message: "Hệ thống lỗi",
            };
        }
    } catch (error) {
        // Xử lý lỗi truy vấn
        console.error(error);
        throw error;
    }
}
const updatePayment = async (id, status,txnNo) => {
    try {
        const res = await client.query(`
        UPDATE public.payment
        SET  status= $2 ,txn_no = $3
        WHERE txn_ref =  $1   
        `, [id,status,txnNo]);
        if (res.rowCount == 1 ) {
            return {
                status: 200,
                data: 'done'
            };
        } else {
            return {
                status: 400,
                message: "Hệ thống lỗi",
            };
        }
    } catch (error) {
        // Xử lý lỗi truy vấn
        console.error(error);
        throw error;
    }
}
module.exports = {
    paymentCreate,
    getPaymentInDB,
    getPaymentListForUserInDB,
    updatePayment,
}