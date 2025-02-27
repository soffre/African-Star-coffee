const { authentication} = require('../controller/authController')
const {
    updateProfile,
    getMyProfile} = require('../controller/userController')

const router = require('express').Router()

router.route('/myProfile').get(authentication, getMyProfile)
router.route('/updateProfile').patch(authentication, updateProfile)

module.exports = router