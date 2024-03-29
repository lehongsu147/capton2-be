const client = require('../db')

const getAllPgtFromDb = async (Type, KeyWord, Category, Rate, Comment) => {
    let sql = `SELECT 
        "user".id AS id, 
        "user".avatar, 
        "user".user_name, 
        "user".hot_pgt, 
        "user".image AS image, 
        "user".text_short
        FROM "user"
        LEFT JOIN CategoryList ON "user".id = CategoryList.user_id
    WHERE "user".role_id = 2`;

    if (Type == 10) {
        sql += ` AND hot_pgt = true`;
    }
    else {
        sql += ` AND hot_pgt = false`;
    }

    if (KeyWord && KeyWord !== '') {
        sql += ` AND user_name ILIKE '%${KeyWord}%'`;
    }

    if (Category) {
        sql += ` AND CategoryList.category_id = ${Category}`;
    }
    const queryResult = await client.query(sql);

    return queryResult;
}
const getFeedbackFromDb = async (id) => {
    // lấy danh sách các feedback booking
    let sql = `SELECT b.id,b.status, b.date, user_id, rate, comment,u.avatar, u.user_name,time_from,
	b.time_to
    FROM public.booking b 
	INNER JOIN public."user" u ON b.user_id = u.id
    WHERE pgt_id = ${id} and b.status = 5
    ORDER BY date DESC;
    `;
    // lấy số lương booking status = 5
    let sqlStatusDone=`SELECT COUNT(*) FROM public.booking WHERE pgt_id = ${id} AND status = 5`
    const queryResult = await client.query(sql);
    const queryStatusDoneResult = await client.query(sqlStatusDone);
    if (queryResult.rows){
        return {
            status: 200,
            data: queryResult.rows,
            rate: ( queryStatusDoneResult.rows[0].count/ queryResult.rows.length )* 100
        }
    }else{
        return null
    }
}
const getUserFromDB = async (id) => {
    const sql = ` SELECT * FROM public."user" where id = ${id} `;
    const queryResult = await client.query(sql);
    return queryResult;
}
const getListImageUserFromDB = async (id) => {
    const sql = `SELECT link FROM public.galery WHERE user_id = ${id} `;
    const queryResult = await client.query(sql);
    return queryResult.rows;
}
const updateInfoPricePgt = async (id, price) => {
    const sql = `UPDATE public."user" SET role_id = 4 ,price=${price} WHERE id=${id}`
    const queryResult = await client.query(sql);
    return queryResult;
}
const updateInfoRequestPgt = async (id, Type) => {
    // Accept Request
    let role_id;
    // Deny Request
    if (Type === 10) {
        role_id = 1;
    }
    if (Type === 20) {
        role_id = 2;
    }
    const sql = `UPDATE public."user" SET role_id = ${role_id} WHERE id=${id}`;
    const queryResult = await client.query(sql);
    return queryResult.rowCount;
}

const updateCategoryListForPgt = async (id, list) => {
    let queryResult;
    if (list?.length > 0) {
        for (const item of list) {
            // Check if the combination of user_id and category_id already exists
            const checkDuplicateSql = `
                SELECT * FROM public.categorylist
                WHERE user_id = $1 AND category_id = $2;
            `;
            const duplicateCheckParams = [id, item];
            try {
                const duplicateCheckResult = await client.query(checkDuplicateSql, duplicateCheckParams);
                // If the combination doesn't exist, proceed with the insertion
                if (duplicateCheckResult.rows.length === 0) {
                    const insertSql = `
                        INSERT INTO public.categorylist(user_id, category_id)
                        VALUES (${id}, ${item});
                    `;
                    try {
                        queryResult = await client.query(insertSql);
                        // Handle the query result if needed
                    } catch (error) {
                        // Handle the error if the insert query fails
                        console.error('Error executing SQL insert query:', error.message);
                    }
                } else {
                    // Log a message or take other action if the combination already exists
                    console.log(`Combination user_id: ${id}, category_id: ${item} already exists.`);
                }
            } catch (error) {
                // Handle the error if the duplicate check query fails
                console.error('Error executing SQL duplicate check query:', error.message);
            }
        }
    }
    return queryResult;
};


const deleteRequestToPgtInDb = async (id) => {
    try {
        let sql = `
        DELETE FROM public.category
	    WHERE id = ${id};
        `;
        const res = await client.query(sql);
        if (res.rowCount === 1) {
            return {
                status: 200,
                message: "Xóa lĩnh vực thành công.",
            };
        } else {
            return {
                status: 400,
                message: "Hệ thống lỗi",
            };
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    getAllPgtFromDb,
    getFeedbackFromDb,
    getListImageUserFromDB,
    getUserFromDB,
    updateInfoPricePgt,
    updateCategoryListForPgt,
    updateInfoRequestPgt
}