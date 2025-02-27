const { authentication, restrictTo } = require('../controller/authController')
const {
    createProduct,
    getAllProduct,
    getProductById,
    deleteProductById,
    getByCategory,
    getByRoastOrOrigin,
    getByNewArrival,
    filterByPrice,
    searchBySlug,
    updateProductById,
    sortProductBy } = require('../controller/productController')

const { upload } = require('../utils/upload')

const router = require('express').Router()

router.route('/')
    .post(authentication,restrictTo('1'), upload.array('Images', 10), createProduct)
    .get(getAllProduct)

router.route('/by_product_id/:id')
    .get(getProductById)
    .delete(authentication, restrictTo('1'), deleteProductById)
    .patch(authentication,restrictTo('1'), upload.array('Images', 10), updateProductById)

router.route('/by_category_id/:category_id').get(getByCategory)
router.route('/by_category/:category_slug').get(getByCategory)
router.route('/by_roastLevel/:roastLevel').get(getByRoastOrOrigin)
router.route('/by_origin/:origin').get(getByRoastOrOrigin)

router.route('/by_newest').get(getByNewArrival)
router.route('/by_price').get(filterByPrice)
router.route('/search').get(searchBySlug)
router.route('/sortBy').get(sortProductBy)


module.exports = router