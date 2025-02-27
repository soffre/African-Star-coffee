const { 
    createUser, 
    getAllUsers } = require('../controller/adminController')
const { authentication, restrictTo } = require('../controller/authController')

const router = require('express').Router()

router.route("/createUser").post(authentication, restrictTo('0'), createUser)
router.route('/users').get(authentication, restrictTo('0'), getAllUsers)

module.exports = router