const { 
    createUser, 
    getAllUsers, 
    filterByUserType,
    deactiveUser,
    activateUser,
    getDeactivatedUser} = require('../controller/adminController')
const { authentication, restrictTo } = require('../controller/authController')

const router = require('express').Router()

router.route("/createUser").post(authentication, restrictTo('0'), createUser)
router.route('/users').get(authentication, restrictTo('0'), getAllUsers)
router.route('/filterByUserType').get(authentication, restrictTo('0'), filterByUserType)
router.route('/deactivate/:userId').delete(authentication, restrictTo('0'), deactiveUser)
router.route('/activate/:userId').patch(authentication, restrictTo('0'), activateUser)
router.route('/deactivateUsers').get(authentication, restrictTo('0'), getDeactivatedUser)
module.exports = router