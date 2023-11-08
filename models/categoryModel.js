const client = require('../db')

const getCategories = async () => {
    const res = await client.query('SELECT * FROM Category')
    return res.rows
}

module.exports = {getCategories}