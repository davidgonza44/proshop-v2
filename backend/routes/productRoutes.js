import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts
} from "../controllers/products.controllers.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router()

router.get('/', getProducts)
router.get('/search/:keyword', getProducts)
router.get('/top', getTopProducts)
router.get('/:id', getProductById)
router.post('/', protect , admin, createProduct )
router.put('/:id',protect, admin, updateProduct)
router.delete('/:id',protect, admin, deleteProduct)
router.post('/product/:id/reviews', protect, createProductReview)
router.get('/:pageNumber' , getProducts)

export default router