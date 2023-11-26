const { getListCategoryFromDb } = require('../models/accountModel');
const { getListImageUserFromDB, getAllPgtFromDb, getListGamePgtFromDb, getUserFromDB, updateInfoPricePgt, updateCategoryListForPgt, updateInfoRequestPgt } = require('../models/pgtModel')

const parseDataPGT = (queryResult, queryListGameOfPgt, listImage) => {
    const users = {};
    for (let row of queryResult.rows) {
        const userId = row.id;
        if (!users[userId]) {
            users[userId] = {
                id: userId,
                user_name: row.user_name,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                image: row.image,
                avatar: row.avatar,
                address: row.address,
                province: row.province,
                facebook: row.facebook,
                tiktok: row.tiktok,
                youtube: row.youtube,
                instagram: row.instagram,
                phone: row.phone,
                textShort: row.text_short,
                star: 4.5,
                comment: 452,
                flag: row.flag,
                price: row?.price,
                follower: row?.follower,
                introduction: row?.introduction,
                status: row?.status,
                rate: '87',
                countRental: 6280,
                countComment: 2323,
                listImage: listImage,
                listgame: []
            };
        }
    }
    for (let game of queryListGameOfPgt.rows) {
        if (users[game.id]) {
            users[game.id].listgame.push({
                id: game.category_id,
                name: game.category_name,
                image: game.image_category
            });
        }
    }
    return Object.values(users);
}
const parseDataListPGT = (queryResult, queryListGameOfPgt) => {
    const users = {};
    for (let row of queryResult.rows) {
        const userId = row.id;
        if (!users[userId]) {
            users[userId] = {
                id: userId,
                username: row.user_name,
                avatar: row.avatar,
                hot_pgt: row?.hot_pgt,
                image: row.image,
                textShort: row.text_short,
                star: 4.5,
                comment: 452,
                listgame: []
            };
        }
    }

    for (let game of queryListGameOfPgt.rows) {
        if (users[game.id]) {
            users[game.id].listgame.push({
                id: game.category_id,
                name: game.category_name,
                image: game.image_category
            });
        }
    }
    return Object.values(users);

}
const getPgtList = async (req, res) => {
    try {
        const { Type, KeyWord, Category, Rate, Comment } = req.query
        const queryListPgt = await getAllPgtFromDb(Type, KeyWord, Category, Rate, Comment);
        const queryListGameOfPgt = await getListCategoryFromDb();
        const userList = parseDataListPGT(queryListPgt, queryListGameOfPgt);
        res.json(userList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPgtDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const infoPGT = await getUserFromDB(id);
        const listImage = await getListImageUserFromDB(id);
        const queryListGameOfPgt = await getListCategoryFromDb();
        const userList = parseDataPGT(infoPGT, queryListGameOfPgt, listImage);
        res.json(userList);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal server error' });
    }
};

const requestToPgt = async (req, res) => {
    const { id } = req.params;
    const { categories, price } = req.body;
    try {
        await updateInfoPricePgt(id, price);
        await updateCategoryListForPgt(id, categories);
        return res.status(200).json({
            status: 200,
        });
    } catch (error) {
        res.status(400).json({ error: 'Hệ thống lỗi' });
    }
}
const deleteRequestToPgt = async (req, res) => {
    const { id } = req.params;
    try {
        const resp = await updateInfoRequestPgt(id, 2);
        return res.status(200).json({
            status: 200,
        });
    } catch (error) {
        res.status(400).json({ error: 'Hệ thống lỗi' });
    }
}

const acceptInfoRequestBooking = async (req, res) => {
    const { id } = req.params;
    const { Type } = req.query;
    try {
        const resp = await updateInfoRequestPgt(id, parseInt(Type));
        if (resp == 1) {
            return res.status(200).json({
                status: 200,
            });
        }
    } catch (error) {
        res.status(400).json({ error: 'Hệ thống lỗi' });
    }
}
module.exports = {
    getPgtList,
    getPgtDetail,
    requestToPgt,
    deleteRequestToPgt,
    acceptInfoRequestBooking
}