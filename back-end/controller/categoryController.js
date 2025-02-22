const categories = require("../db/models/categories");
const product = require("../db/models/product");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


const createCategory = catchAsync(async (req, res, next) => {
    const { name, description } = req.body

    const newCategory = await categories.create({
        name: name,
        description: description,
    })

    if (!newCategory) {
        return next(new AppError('Failed to create the category', 400))
    }

    const result = newCategory.toJSON()
    delete result.deletedAt
    delete result.description
    delete result.createdAt
    delete result.updatedAt

    return res.status(201).json({
        status: 'success',
        data: result
    })

})

const getAll = catchAsync(async (req, res, next) => {
    const result = await categories.findAll()

    if (!result || result.length === 0) {
        return next(new AppError('No category find. please add to get', 400))
    }
    const newResult = result.map(item => item.toJSON())

    newResult.forEach(item => {
        delete item.deletedAt
        delete item.createdAt
        delete item.updatedAt
    })

    return res.status(200).json({
        status: 'success',
        data: newResult

    })
})

const updateById = catchAsync(async (req, res, next) => {
    const categoryId = req.params.id
    const { name, description } = req.body

    const result = await categories.findByPk(categoryId)

    if (!result || result.length === 0) {
        return next(new AppError('Inavlid category id', 400))
    }

    await categories.update({
        name: name,
        description: description
    }, {
        where: { id: categoryId}
    })
    return res.status(200).json({
        status: 'success',
        message: 'Recored updated successfully'
    })
})

const getById = catchAsync(async (req, res, next) => {
    const categoryId = req.params.id
   
    const category = await categories.findByPk(categoryId)

    if (!category || category.length === 0) {
        return next(new AppError('Inavlid category id', 400))
    }

    const newCategory = category.toJSON()
    delete newCategory.deletedAt
    delete newCategory.createdAt
    delete newCategory.updatedAt

    return res.status(200).json({
        status: 'success',
        data: newCategory
    })
})

const deleteById = catchAsync(async (req, res, next) => {
    const categoryId = req.params.id

    const result = await categories.findOne({
        where: { id: categoryId}
    })
    if (!result) {
        return next(new AppError('Invalid category id'), 400)
    }

    await result.destroy()
    return res.status(200).json({
        status: 'success',
        message: 'Recored deleted successfully'
    })
})

module.exports = {
    createCategory,
    getAll,
    updateById,
    getById,
    deleteById,
}