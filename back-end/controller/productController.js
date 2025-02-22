const path = require('path')
const fs = require('fs')

const categories = require("../db/models/categories");
const image = require("../db/models/image");
const product = require("../db/models/product");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Op } = require('sequelize');


const createProduct = catchAsync(async (req, res, next) => {
    const body = req.body

    const result = await categories.findByPk(body.category_id)

    if (!result || result.length === 0) {
        return next(new AppError('Invalid category_id', 400))
    }

    // product creation
    const newproduct = await product.create({
        title: body.title,
        shortDescription: body.shortDescription,
        description: body.description,
        category_id: body.category_id,
        roast_level: body.roast_level,
        origin: body.origin,
        processing_method: body.processing_method,
        price: body.price,
        stock_quantity: body.stock_quantity,
        unit: body.unit
    })

    if (!newproduct) {
        return next(new AppError('Product creation fail', 400))
    }

    const updatedProduct = newproduct.toJSON()

    // image or file uploading
    if (req.files && req.files.length > 0) {
        const newImage = req.files.map((files) => ({
            product_id: newproduct.id,
            file_name: files.filename,
            path: `/product/image/${files.filename}`,
            size: files.size,
        }))
        await image.bulkCreate(newImage)
    }

    return res.status(201).json({
        status: 'success',
        data: updatedProduct // in integration change this to message ; 'Product creation successfully done!'
    })

})

const getAllProduct = catchAsync(async (req, res, next) => {
    //parse the page and pageSize form the query parameter for pagination
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    const offset = (page - 1) * pageSize

    //fetch the all product by including categorie and images and how much product and in next how much product pass(offset)
    const allProduct = await product.findAndCountAll({
        distinct: true,
        attributes: ['id', 'title', 'price', 'unit', 'roast_level', 'origin', 'createdAt'],
        include: [
            { model: categories, attributes: { exclude: ['description', 'createdAt', 'updatedAt', 'deletedAt'] } },
            { model: image, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'size', 'product_id'] } },
        ],
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: pageSize
    })

    if (!allProduct || allProduct.count === 0) {
        return next(new AppError('No product found. Add new product please', 404))
    }

    // retrun to the products and current page and page size for pagination, for next request the page should increase by one.
    // to calculate the totalPage in front end = total/pageSize 
    return res.status(200).json({
        status: 'success',
        data: {
            products: allProduct.rows,
            total: allProduct.count,
            currentPage: page,
            totalPages: Math.ceil(allProduct.count / pageSize),
            pageSize
        }
    })
})

const getProductById = catchAsync(async (req, res, next) => {
    const productId = req.params.id

    const result = await product.findByPk(productId, {
        attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'category_id'] },
        include: [
            { model: categories, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } },
            { model: image, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'size', 'product_id'] } },
        ],
    })
    if (!result || result.length === 0) {
        return next(new AppError('No product found with this Id', 404))
    }

    return res.status(200).json({
        status: 'success',
        data: result
    })

})

const updateProductById = catchAsync(async(req, res, next) => {
    const productId = req.params.id
    const body = req.body

    // Find the existing product
    const existingProduct = await product.findOne({
        include: image,
        where: {id: productId}
    })

    if (!existingProduct) {
        return next(new AppError('No product found with this Id', 404))
    }

    existingProduct.toJSON()
        // Update product details
    await existingProduct.update({
        title: body.title,
        shortDescription: body.shortDescription,
        description: body.description,
        category_id: body.category_id,
        roast_level: body.roast_level,
        origin: body.origin,
        processing_method: body.processing_method,
        price: body.price,
        stock_quantity: body.stock_quantity,
        unit: body.unit
    })
    
     // Handle image updates
     if(req.files && req.files.length > 0){
        // Delete old images from storage
        const existingImage = existingProduct.images
        existingImage.forEach( img => {
            const imagePath = path.join(__dirname, '../public',img.path)
            if(fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath)
            }
        })
        
         // Delete old image records from database
         await image.destroy({ where: { product_id: productId } })

         // Insert new image records
         const newImages = req.files.map(file => ({
            product_id: existingProduct.id,
            file_name: file.filename,
            path: `/product/image/${file.filename}`,
            size: file.size,
         }))
         await image.bulkCreate(newImages)
    }

    return res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: existingProduct
    })
})

const deleteProductById = catchAsync(async (req, res, next) => {
    const productId = req.params.id

    const result = await product.findOne({
        include: image,
        where: { id: productId }
    })

    if (!result || result.length === 0) {
        return next(new AppError('No product found with this Id', 404))
    }

    const newImageresult = result.toJSON()

    // delete the actuall image file from public folder
    newImageresult.images.forEach(img => {
        const imagePath = path.join(__dirname, '../public', img.path)

        //check if the file exist before deleteing
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }
    })

    // deleting the image
    await image.destroy({ where: { product_id: productId } })

    // deleting the product
    await result.destroy()

    return res.status(200).json({
        status: 'success',
        message: 'Product and associated images deleted successfully'
    })
})


const getByCategory = catchAsync(async (req, res, next) => {
    //parse the page and pageSize form the query parameter for pagination
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    const offset = (page - 1) * pageSize

    // create empty query object for conditioning the query
    const categoryQuery = {}

    // assign category_slug or category_id to the query object
    if (req.params.category_slug) {
        categoryQuery.slug = req.params.category_slug
    }
    else {
        categoryQuery.id = req.params.category_id
    }

    // fetch the products based on the what category they are in
    const products = await product.findAndCountAll({
        distinct: true,
        attributes: ['id', 'title', 'price', 'unit', 'roast_level', 'origin', 'createdAt'],
        include: [
            { model: categories, where: categoryQuery, attributes: { exclude: ['description', 'createdAt', 'updatedAt', 'deletedAt'] } }
        ],
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: pageSize,
    })

    if (!products.rows.length) {
        return next(new AppError('No products found.', 404))
    }

    return res.status(200).json({
        status: 'success',
        data: {
            products: products.rows,
            total: products.count,
            currentPage: page,
            totalPages: Math.ceil(products.count / pageSize),
            pageSize
        }
    })
})

const getByRoastOrOrigin = catchAsync(async (req, res, next) => {
    //parse the page and pageSize form the query parameter for pagination
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    const offset = (page - 1) * pageSize

    // identify and assign which attribute is send
    const query = {}
    if (req.params.origin) {
        query.origin = req.params.origin
    }
    else {
        query.roast_level = req.params.roastLevel
    }
  
    const products = await product.findAndCountAll({
        distinct: true,
        attributes: ['id', 'title', 'price', 'unit', 'roast_level', 'origin', 'createdAt'], where: query,
        include: [
            { model: categories, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } },
            { model: image, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'size', 'product_id'] } },
        ],
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: pageSize
    })
    if (!products.rows.length) {
        return next(new AppError('No products found', 404))
    }

    return res.status(200).json({
        status: 'success',
        data: {
            products: products.rows,
            total: products.count,
            currentPage: page,
            totalPages: Math.ceil(products.count / pageSize),
            pageSize
        }
    })
})

const getByNewArrival = catchAsync(async (req, res, next) => {
    //parse the page and pageSize form the query parameter for pagination
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    const offset = (page - 1) * pageSize

    const newProducts = await product.findAndCountAll({
        distinct: true,
        attributes: ['id', 'title', 'price', 'unit', 'roast_level', 'origin', 'createdAt'],
        include: [
            { model: categories, attributes: ['id', 'name', 'slug'] },
            { model: image, attributes: ['id', 'file_name', 'path'] }
        ],
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: pageSize
    })

    if (!newProducts.rows.length) {
        return next(new AppError('No products found', 404))
    }
    return res.status(200).json({
        status: 'success',
        data: {
            products: newProducts.rows,
            total: newProducts.count,
            currentPage: page,
            totalPages: Math.ceil(newProducts.count / pageSize),
            pageSize
        }
    })
})

const filterByPrice = catchAsync(async (req, res, next) => {
    //parse the page and pageSize form the query parameter for pagination
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    const offset = (page - 1) * pageSize

    // get the price min & max
    const minPrice = parseInt(req.query.minPrice) || 0
    const maxPrice = parseInt(req.query.maxPrice) || 2000 //update based on the given data

    const allProducts = await product.findAndCountAll({
        distinct: true,
        attributes: ['id', 'title', 'price', 'unit', 'roast_level', 'origin', 'createdAt'],
        where: {
            price: { [Op.between]: [minPrice, maxPrice] }
        },
        include: [
            { model: categories, attributes: ['id', 'name', 'slug'] },
            { model: image, attributes: ['id', 'file_name', 'path'] }
        ],
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: pageSize
    })

    if (!allProducts.rows.length) {
        return next(new AppError('No products found', 404))
    }
    return res.status(200).json({
        status: 'success',
        data: {
            products: allProducts.rows,
            total: allProducts.count,
            currentPage: page,
            totalPages: Math.ceil(allProducts.count / pageSize),
            pageSize
        }
    })
})

const searchBySlug = catchAsync(async (req, res, next) => {
    //parse the page and pageSize form the query parameter for pagination
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 5
    const offset = (page - 1) * pageSize
    const { slug } = req.query;

    // Validate slug input
    if (!slug || slug.trim().length < 1) {
        return next(new AppError('Search term cannot be empty', 400));
    }

    const products = await product.findAndCountAll({
        distinct: true,
        attributes: ['id', 'title', 'price', 'unit', 'roast_level', 'origin', 'createdAt'],
        where: {
            slug: { [Op.like]: `%${slug}%` },
        },
        include: [
            { model: categories, attributes: ['id', 'name', 'slug'] },
            { model: image, attributes: ['id', 'file_name', 'path'] }
        ],
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: pageSize
    })

    if (!products.rows.length) {
        return next(new AppError('No products found', 404))
    }

    return res.status(200).json({
        status: 'success',
        data: {
            products: products.rows,
            total: products.count,
            currentPage: page,
            totalPages: Math.ceil(products.count / pageSize),
            pageSize
        }
    })
})

module.exports = {
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
}