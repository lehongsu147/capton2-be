const client = require('../db')

const getAllPgtFromDb = async () => {
    const sql = ` SELECT id,user_name,image FROM public."user" where role_id = 2 `;

    const queryResult = await client.query(sql);

    return queryResult;
}

const getListGamePgtFromDb = async () => {
    const sql = ` SELECT 
    "user".id as userid, 
    "category".name as category_name,
    "category".id as category_id,
    "category".image as image_category
    FROM "user"
    LEFT JOIN  CategoryList ON  "user".id = CategoryList.user_id
    LEFT JOIN  "category" ON CategoryList.category_id = "category"."id"
    where role_id = 2
    `;

    const queryResult = await client.query(sql);

    return queryResult;
}


const getListHotPGT = async () => {
    const res = await client.query('SELECT * FROM public."user"')
    return res.rows
}

module.exports = {
    getAllPgtFromDb,
    getListGamePgtFromDb,
}