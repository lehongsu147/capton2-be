const { getAllPgtFromDb, getListGamePgtFromDb } = require('../models/pgtModel')

const parseData = (queryResult,queryListGameOfPgt) => {

    const users = {};

    for(let row of queryResult.rows) {

        const userId = row.id;

        if (!users[userId]) {

          users[userId] = {

            key: userId,

            username: row.user_name,

            avatar: row.avatar,
            
            image: row.image,

            textShort: row.textshort,

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

const getPgtList = async(req, res) => {

    try {
        const queryListPgt = await getAllPgtFromDb();
        const queryListGameOfPgt = await getListGamePgtFromDb();

        const userList = parseData(queryListPgt,queryListGameOfPgt);

        res.json(userList);

    } catch(error) {

        console.error(error);

        res.status(500).json({error: 'Internal server error'});

    }

};

module.exports = {
    getPgtList
}