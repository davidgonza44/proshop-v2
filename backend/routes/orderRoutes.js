import express from "express";
import { getAllOrders , getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, addOrderItems}
from "../controllers/orders.controllers.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post('/', protect, addOrderItems)
router.get('/', protect, admin, getAllOrders)
router.get('/:pageNumber', protect, admin, getAllOrders)
router.get('/mine', protect, getMyOrders)
router.get('/order/:id', protect, getOrderById)
router.put('/:id/pay', protect, updateOrderToPaid)
router.put('/:id/deliver',protect,admin, updateOrderToDelivered)




export default router;