const { Op } = require("sequelize");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createUser = catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, phoneNo, password, confirmPassword, userType } = req.body

    if (!['1', '2'].includes(userType)) {
       return next(new AppError('Invalid user type', 400))
    }

    const newUser = await user.create({
        userType: userType,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNo: phoneNo,
        password: password,
        confirmPassword: confirmPassword
    })
    if (!newUser) {
        return next(new AppError('User creation fail', 400))
    }

    const result = newUser.toJSON();

    delete result.userType
    delete result.password
    delete result.deletedAt
    delete result.createdAt
    delete result.updatedAt

    return res.status(200).json({
        status: 'success',
        data: result,
    })
})


const getAllUsers = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const offset = (page - 1) * pageSize


    const allUsers = await user.findAndCountAll({
        distinct: true,
        attributes: { exclude: ['updatedAt', 'deletedAt', 'password'] },
        where: {
            userType: {[Op.in]: ['1','2']}
        },
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: pageSize
    })

    if (!allUsers.rows || allUsers.rows.length === 0) {
        return next(new AppError(`Can't find any user`, 404))
    }

    return res.status(200).json({
        status: 'success',
        data: {
            users: allUsers.rows,
            total: allUsers.count,
            currentPage: page,
            totalPages: Math.ceil(allUsers.count / pageSize),
            pageSize
        }
    })
})

module.exports = {
    createUser,
    getAllUsers,
}