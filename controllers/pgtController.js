const {getListImageUserFromDB, getAllPgtFromDb, getListGamePgtFromDb,getUserFromDB } = require('../models/pgtModel')

const parseDataListPGT = (queryResult,queryListGameOfPgt) => {

    const users = {};

    for(let row of queryResult.rows) {

        const userId = row.id;

        if (!users[userId]) {

          users[userId] = {

            id: userId,

            username: row.user_name,

            avatar: row.avatar,
            
            image: row.image,

            textShort: row.text_short,

            star: 4.5,
            
            comment: 452,
            
            listgame: []

          };

        }

    }

    for(let game of queryListGameOfPgt.rows) {

        if (users[game.userid]) {

            users[game.userid].listgame.push({

                id: game.category_id,

                name: game.category_name,

                image: game.image_category

            });

        }

    }
    return Object.values(users);

}
const parseDataPGT = (queryResult,queryListGameOfPgt,listImage) => {

    const users = {};

    for(let row of queryResult.rows) {

        const userId = row.id;

        if (!users[userId]) {

          users[userId] = {

            id: userId,

            username: row.user_name,

            avatar: row.avatar,
            
            image: row.image,

            textShort: row.textshort,

            star: 4.5,
            
            comment: 452,
            
            price: row?.price,
            follower: row?.follower,
            introduction: row?.introduction,
            status: row?.status,
            price: row?.price,
            
            rate: '87',
            countRental: 6280,
            countComment: 2323,
            listImage: listImage,
            listgame: []

          };
        }
    }

    for(let game of queryListGameOfPgt.rows) {

        if (users[game.userid]) {

            users[game.userid].listgame.push({

                id: game.category_id,

                name: game.category_name,

                image: game.image_category

            });
        }
    }
    return Object.values(users);

}

const getPgtList = async(req, res) => {
    try {
        const { Type, KeyWord, Category, Rate, Comment } = req.query

        const queryListPgt = await getAllPgtFromDb(Type,KeyWord, Category, Rate, Comment );
        const queryListGameOfPgt = await getListGamePgtFromDb();

        const userList = parseDataListPGT(queryListPgt,queryListGameOfPgt);

        res.json(userList);

    } catch(error) {

        console.error(error);

        res.status(500).json({error: 'Internal server error'});

    }

};


const getPgtDetail = async(req, res) => {
    try {
        const id = req.params.id;
        const infoPGT = await getUserFromDB(id);
        const listImage = await getListImageUserFromDB(id);
        const queryListGameOfPgt = await getListGamePgtFromDb();

        const userList = parseDataPGT(infoPGT,queryListGameOfPgt,listImage);

        res.json(userList);

    } catch(error) {

        console.error(error);

        res.status(500).json({error: 'Internal server error'});

    }

};
module.exports = {
    getPgtList,
    getPgtDetail
}