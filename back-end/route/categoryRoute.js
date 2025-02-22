const { authentication } = require('../controller/authController')
const { createCategory, getAll, updateById, getById, deleteById } = require('../controller/categoryController')

const router = require('express').Router()

router.route('/').post(authentication, createCategory)
    .get(getAll)

router.route('/:id')
    .patch(authentication, updateById)
    .get(authentication, getById)
    .delete(authentication, deleteById)

module.exports = router