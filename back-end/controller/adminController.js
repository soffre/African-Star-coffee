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
            userType: { [Op.in]: ['1', '2'] }
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

const filterByUserType = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const offset = (page - 1) * pageSize
    const userType = req.query.userType

    if (!['1', '2'].includes(userType)) {
        return next(new AppError('Invalid user type', 400))
    }

    const filterUser = await user.findAndCountAll({
        distinct: true,
        attributes: { exclude: ['updatedAt', 'deletedAt', 'password'] },
        where: {
            userType: userType
        },
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: pageSize
    })

    if (!filterUser.rows || filterUser.rows.length === 0) {
        return next(new AppError(`Can't find any user`, 404))
    }

    return res.status(200).json({
        status: 'success',
        data: {
            users: filterUser.rows,
            total: filterUser.count,
            currentPage: page,
            totalPages: Math.ceil(filterUser.count / pageSize),
            pageSize
        }
    })
})

const deactiveUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params

    const userToDeactivate = await user.findOne({ where: { id: userId } })

    if (!userToDeactivate) {
        return next(new AppError('User Not Found', 404))
    }

    await user.destroy({ where: { id: userId } })

    return res.status(200).json({
        status: 'success',
        message: 'User has been deactivated successfully'
    });
})

const activateUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params

    const activatedUser = await user.restore({ where: { id: userId } })

    if (!activatedUser) {
        return next(new AppError('User Not Found', 404))
    }

    return res.status(200).json({
        status: 'success',
        message: 'User has been activated successfully'
    });
})

const getDeactivatedUser = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const offset = (page - 1) * pageSize

    const deactivatedUser = await user.findAndCountAll({
        paranoid: false,
        distinct: true,
        attributes: { exclude: ['updatedAt', 'password'] },
        where: {
            deletedAt: { [Op.not]: null }
        },
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: pageSize
    })
    if (!deactivatedUser.rows || deactivatedUser.rows.length === 0) {
        return next(new AppError('No deactivated users found', 404))
    }

    return res.status(200).json({
        status: 'success',
        data: {
            users: deactivatedUser.rows,
            total: deactivatedUser.count,
            currentPage: page,
            totalPages: Math.ceil(deactivatedUser.count / pageSize),
            pageSize
        }
    })
})
module.exports = {
    createUser,
    getAllUsers,
    filterByUserType,
    deactiveUser,
    activateUser,
    getDeactivatedUser,
}