const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const updateProfile = catchAsync(async (req, res, next) => {
    const userId = req.user.id
    const { firstName, lastName, email, phoneNo } = req.body

    await user.update({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNo: phoneNo,
    },
        {
            where: { id: userId }
        })

    if (!updatedUser) {
        return next(new AppError("Editing profile fail", 400))
    }

    return res.status(200).json({
        status: 'success',
        message: 'Profile successfully updated',
    })
})

const getMyProfile = catchAsync(async (req, res, next) => {
    const profile = req.user

    if (!profile) {
        return next(new AppError(`Couldn't find your profile`, 400))
    }
    const updatedUser = profile.toJSON()
    delete updatedUser.id
    delete updatedUser.userType
    delete updatedUser.password
    delete updatedUser.createdAt
    delete updatedUser.updatedAt
    delete updatedUser.deletedAt

    return res.status(200).json({
        status: 'success',
        data: updatedUser
    })
})

module.exports = {
    updateProfile,
    getMyProfile,
}