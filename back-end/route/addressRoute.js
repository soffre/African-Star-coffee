const {
    createAddress,
    getAllAddress,
    getAddressById } = require('../controller/addressController')
const { authentication } = require('../controller/authController')
const router = require('express').Router()


router.route('/')
    .post(authentication, createAddress)
    .get(authentication, getAllAddress)

router.route('/by/:id').get(authentication, getAddressById)
module.exports = router