const catchAsync = require("../utils/catchAsync");
const address = require("../db/models/address");
const AppError = require("../utils/appError");
const sequelize = require("../config/database");

const createAddress = catchAsync(async (req, res, next) => {
    const userId = req.user.id
    const body = req.body

    const transaction = await sequelize.transaction() // initiate a transaction
    try {
        if (body.isDefault) {
            await address.update({
                isDefault: false
            }, {
                where: {
                    userId: userId,
                    isDefault: true,
                },
                transaction // Ensure it runs in transaction
            })
        }

        const newAddress = await address.create({
            firstName: body.firstName,
            lastName: body.lastName,
            address: body.address,
            city: body.city,
            country: body.country,
            zip_code: body.zip_code,
            region: body.region,
            phone: body.phone,
            isDefault: body.isDefault,
            userId: userId,
        },
            {
                transaction // Ensure it runs in transaction
            })

        await transaction.commit() // commit the transaction

        const updatedAddress = newAddress.toJSON()
        delete updatedAddress.createdAt
        delete updatedAddress.updatedAt
        delete updatedAddress.deletedAt

        return res.status(200).json({
            status: 'success',
            message: 'Address created successfullly',
            data: updatedAddress
        })

    } catch (error) {
        await transaction.rollback() // roll back the transaction if error is happend
        return next(new AppError(error.message, 400))
    }
})

const deleteAddress = catchAsync(async (req, res, next) => {
    // prevent or anounce user to chnage the address before deleted it if that address is already assign to an order that is not delivered or complate
    // then delete the address from the order and and address table 
    // use transaction if it needed

})

const updateAddress = catchAsync(async (req, res, next) => {
    // allow to update the address if order that uses this address is not being shipped or not start to shipping
})

const getAllAddress = catchAsync(async (req, res, next) => {
    const userId = req.user.id

    const allAddress = await address.findAndCountAll({
        distinct: true,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
    })

    if (!allAddress.rows || allAddress.rows.length === 0) {
        return next(new AppError('No address found', 400))
    }

    return res.status(200).json({
        status: 'success',
        data: {
            addresses: allAddress.rows,
            total: allAddress.count
        }
    })
})

const getAddressById = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const result = await address.findByPk(id, {
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    })
    if (!result || result.length === 0) {
        return next(new AppError('No address found with this id', 400))
    }

    return res.status(200).json({
        status: 'success',
        data: result
    })
})

module.exports = {
    createAddress,
    getAllAddress,
    getAddressById,
}