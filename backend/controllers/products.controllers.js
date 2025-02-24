import asyncHandler from "../middleware/asyncHandler.js"
import Product from "../models/productModel.js"

// @des Get product by id
// @route GET /api/products/:id
// @ access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error('Product not found')
    }

    return res.json(product)
})

// @des Get all products
// @route GET /api/products
// @ access Public
const getProducts = asyncHandler(async (req, res) => {
    const pageNumber = req.query.pageNumber || 1
    const pageSize = 4
    const skip = (pageNumber - 1) * pageSize  //
    const keyword = req.query.keyword ? {
        name : {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}
    const count = await Product.countDocuments({...keyword})

    const products = await Product.find({...keyword}).limit(pageSize).skip(skip)// esto lo que hace es que te muestre los 4 productos de la pagina 1 y los 4 de la 2 y asi sucesivamente
    const pages = Math.ceil(count / pageSize)
    return res.json({ products, pages, page: pageNumber})

})

// @des Create new product
// @route POST /api/products
// @ access Private / admib
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    })
    const createdProduct = await product.save()
    return res.status(201).json(createdProduct)
})

// @desc UPDATE product
// @route PUT /api/products/:id
// @access Private / admin

const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        res.status(404)
        throw new Error('Product not found')
    } else {
        product.name = req.body.name || product.name
        product.price = req.body.price || product.price
        product.description = req.body.description || product.description
        product.image = req.body.image || product.image
        product.brand = req.body.brand || product.brand
        product.category = req.body.category || product.category
        product.countInStock = req.body.countInStock || product.countInStock
        product.numReviews = req.body.numReviews || product.numReviews
        const updatedProduct = await product.save()
        return res.json(updatedProduct)
    }

})

// @desc DELETE product
// @route DELETE /api/products/:id
// @access Private / admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        res.status(404)
        throw new Error('Product not Found')
    } else {
        await product.deleteOne()
        return res.json('Product removed successfully')
    }
})


// @desc Create new review
// @route POST /api/product/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if(!product){
        res.status(404)
        throw new Error('Product not Found')
    }
    const alreadyReviewed = product.reviews.find((review) =>
        review.user.toString === product.user.toString )

    if (alreadyReviewed){
        res.status(400)
        throw new Error('Already reviewed!')
    }

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user : req.user._id
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating = product.reviews.reduce((acc, review)=> acc + review.rating,0) / product.reviews.length
    await product.save()
    res.status(201).status.json({message : 'Review added'})
})


// @desc Get top rated products
// @route GET /api/products/top
// @access Public

const getTopProducts = asyncHandler(async (req, res)=> {
    const products = await Product.find({}).sort({rating: -1}).limit(3)
    res.json(products)
})

export {
    getProductById,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts
}
