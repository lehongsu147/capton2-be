const client = require('../db')
const AvatarDefault = 'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg'
const ImageDefault = 'https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg'
const loginDB = async (email, password) => {
    try {
        const res = await client.query(
            `SELECT "user".id, "user".user_name, "user".first_name, "user".last_name, "user".email, "user".avatar, "user".role_id, "role".name as role_name
            FROM "user"
            JOIN "role" ON "user".role_id = "role".id
            where email= $1   and password = $2`,
            [email, password]
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

const signupDB = async (email, password) => {
    try {
        // Kiểm tra xem có bản ghi với địa chỉ email đã tồn tại không
        const emailCheck = await client.query(`
        SELECT * FROM public."user" WHERE email = $1;`,
        [email] );
        if (emailCheck.rows.length > 0) {
            return {
                status: 400,
                message: "Địa chỉ email đã tồn tại"
            };
        }
        
        // Nếu địa chỉ email không tồn tại, thì tiến hành tạo tài khoản
        const res = await client.query(`
            INSERT INTO public."user"(email, password, avatar, image)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`, [email, password, AvatarDefault, ImageDefault]
        );
        console.log(res);
        if (res.rows.length > 0) {
            return {
                status: 200,
                message: "Đăng ký thành công",
                user: res.rows[0]
            };
        } else {
            return {
                status: -1,
                message: "Đăng ký thất bại"
            };
        }
    } catch (error) {
        // Xử lý lỗi truy vấn
        console.error(error);
        throw error;
    }
}
    
module.exports = { loginDB,signupDB }