const client = require('../db')

const getAllPgtFromDb = async (Type, KeyWord, Category, Rate, Comment) => {
    let sql = `SELECT 
        "user".id AS id, 
        "user".user_name, 
        "user".image AS image, 
        "user".text_short
        FROM "user"
        LEFT JOIN CategoryList ON "user".id = CategoryList.user_id
    WHERE "user".role_id = 2`;
   
    if (Type == 10) {
        sql += ` AND hot_pgt = true`;
    }
    
    if ( KeyWord && KeyWord !== '') {
        sql += ` AND user_name ILIKE '%${KeyWord}%'`;
    }
    
    if (Category) {
        sql += ` AND CategoryList.category_id = ${Category}`;
      }
    
    // if (Rate) {
    //     sql += ` AND rate = ${Rate}`;
    // }
    
    // if (Comment) {
    //     sql += ` AND comment = ${Comment}`;
    // }
    

    const queryResult = await client.query(sql);

    return queryResult;
}

const getUserFromDB = async (id) => {
    const sql = ` SELECT id,user_name,image,status,price,follower,introduction FROM public."user" where id = ${id} `;
    const queryResult = await client.query(sql);
    return queryResult;
}


const getListImageUserFromDB = async (id) => {
    const sql = `SELECT link FROM public.galery WHERE user_id = ${id} `;
    const queryResult = await client.query(sql);
    return queryResult.rows;
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
    getListImageUserFromDB,
    getUserFromDB,
}