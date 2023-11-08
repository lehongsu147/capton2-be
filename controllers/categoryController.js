const categoryModel = require('../models/categoryModel')

const getCategoryList = async (req, res) => {

    try {

        const categories = await categoryModel.getCategories()

        res.status(200).json(categories)

    } catch(err) {

        res.status(500).json({message: err.message})

    }

}

module.exports = {
    getCategoryList
}