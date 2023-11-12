const client = require('../db');
const moment = require('moment');
const { getTime }  = require('./Utils/Utils');

const getBookingDetail = async (id) => {
    try {
        const res = await client.query(
        `SELECT
            b.id AS id,
            u.user_name AS pgt_name,
            b.user_id as user_id,
            u2.user_name AS user_name,
            b.date,
            b.price,
            b.status AS status,
            b.time_from,
            b.time_to
        FROM
            booking b
        JOIN
            "user" u ON b.kol_id = u.id
        JOIN
            "user" u2 ON b.user_id = u2.id
        WHERE
        b.id = $1`,
            [id]
        );
        if (res.rows) {
            return res.rows[0];
        }
        else {
            return null;
        }
    } catch (error) {
        // Xử lý lỗi truy vấn
        console.error(error);
        throw error;
    }
}

const getListBookingOfUserFromDb = async (id) => {
    try {
        const res = await client.query(
            `SELECT
            b.id AS id,
            u.user_name AS pgt_name,
            b.date,
            b.price,
            b.status AS status,
            b.time_from,
            b.time_to
        FROM
            booking b
        JOIN
            "user" u ON b.kol_id = u.id
        WHERE
            b.user_id = $1
        ORDER BY b.date DESC`,
            [id]
        );
        // const res = await client.query(
        //     `SELECT
        //     b.id AS id,
        //     u.user_name AS pgt_name,
        //     c.image AS category_link,
        //     b.category_id,
        //     b.date,
        //     b.price,
        //     b.status AS status,
        //     b.time_from,
        //     b.time_to
        // FROM
        //     booking b
        // JOIN
        //     "user" u ON b.kol_id = u.id
        // JOIN
        //     category c ON b.category_id = c.id
        // WHERE
        //     b.user_id = $1
        // ORDER BY b.created_at ASC`,
        //     [id]
        // );
        if (res.rows) {
            return res.rows;
        }
        else {
            return null;
        }
    } catch (error) {
        // Xử lý lỗi truy vấn
        console.error(error);
        throw error;
    }
}

const getRequestBookingOfPGTFromDb = async (id,type) => {
    try {
        // c.image AS category_link,
        // b.category_id,
            // JOIN
            //  category c ON b.category_id = c.id
            const res = await client.query(
                `SELECT
                b.id AS id,
                u.user_name AS pgt_name,
                b.user_id as user_id,
                u2.user_name AS user_name,
                b.date,
                b.created_at,
                b.price,
                b.status AS status,
                b.time_from,
                b.time_to
            FROM
                booking b
            JOIN
                "user" u ON b.kol_id = u.id
            JOIN
                "user" u2 ON b.user_id = u2.id
            WHERE
                b.kol_id = $1
                AND b.status != 4
            ORDER BY b.created_at DESC`,
                [id]
            );
        if (res.rows) {
            return res.rows;
        }
        else {
            return null;
        }
    } catch (error) {
        // Xử lý lỗi truy vấn
        console.error(error);
        throw error;
    }
}


const getListBookingFromDb = async (id) => {
    try {
        const res = await client.query(
            `SELECT * FROM public.booking where kol_id = $1
            ORDER BY created_at ASC`,
            [id]
        );
        if (res.rows) {
            return res.rows;
        }
        else {
            return null;
        }
    } catch (error) {
        // Xử lý lỗi truy vấn
        console.error(error);
        throw error;
    }
}

const signupBookingDB = async (userId, pgtId,price,date,timeStart,timeEnd,category,note) => {
    try {
        // Kiểm tra xem có userId tồn tại không
        const userCheck = await client.query(`
        SELECT * FROM public."user" WHERE id = $1;`,
        [userId] );
        if (userCheck.rows.length === 0) {
            return {
                status: 400,
                message: "Không tồn tại user"
            };
        }

        // Kiểm tra xem có pgt tồn tại không
        const pgtIdCheck = await client.query(`
        SELECT * FROM public."user" WHERE id = $1 AND role_id =2 ;`,
        [pgtId] );
        if (pgtIdCheck.rows.length === 0) {
            return {
                status: 400,
                message: "Không tồn tại PGT"
            };
        }
      
        // Kiểm tra xem có category tồn tại không
        // const categoryCheck = await client.query(`
        // SELECT * FROM public."category" WHERE id = $1 ;`,
        // [category] );
        // if (categoryCheck.rows.length === 0) {
        //     return {
        //         status: 400,
        //         message: "Không tồn tại lĩnh vực"
        //     };
        // }
        
        // Lấy danh sách các booking IDs có xung đột
        const conflictBooking = await client.query(`
            SELECT
            id, time_from, time_to
            FROM
            booking
            WHERE
            kol_id = $1
            AND date = $2
            AND (
                (time_from <= $3 AND time_to >= $3)
                OR (time_from <= $4 AND time_to >= $4)
                OR ($3 <= time_from AND $4 >= time_from)
            );
        `, [pgtId, date, timeStart, timeEnd]);

        // Kiểm tra xem có xung đột hay không
        
        if (conflictBooking.rows.length > 0) {
            const booking = conflictBooking.rows[0];
            const startTime = getTime(booking.time_from)
            const endTime = getTime(booking.time_to)
            const messsageError = `PGT đã được thuê từ ${startTime} đến ${endTime}`;
            
            return {
                status: 201,
                message: "Lịch sử booking xung đột với lượt thuê mới.",
                messsageError: messsageError,
            };
        }
        
        //  tạo booking
        const res = await client.query(`
        INSERT INTO public.booking (  user_id, kol_id, price, date, time_from, time_to, category_id, description ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id; 
        `, [userId, pgtId, price, date, timeStart, timeEnd, category, note]);
        
        if (res.rows.length > 0) {
            return {
                status: 200,
                message: "Đăng kí booking thành công.",
                bookingId: res.rows  // Trả về ID của booking
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

const updateBookingToDB = async (id,type) => {
    try {
      
        // Kiểm tra xem có booking tồn tại không
        const bookingCheck = await client.query(`
         SELECT id FROM public."booking" WHERE id = $1 ;`,
        [id] );
        if (bookingCheck.rows.length === 0) {
            return {
                status: 400,
                message: "Không tồn tại lượt booking"
            };
        }
        
        //  update  booking
        const res = await client.query(`
            UPDATE public.booking
            SET status= $1
            WHERE id = $2
            RETURNING id; 
        ;`,
        [type,id] );
        
        if (res.rows.length > 0) {
            return {
                status: 200,
                message: "Sửa booking thành công.",
                bookingId: res.rows  // Trả về ID của booking
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
    getListBookingFromDb,
    signupBookingDB,
    getListBookingOfUserFromDb,
    updateBookingToDB,
    getRequestBookingOfPGTFromDb,
    getBookingDetail
}