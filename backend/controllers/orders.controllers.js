import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

// @desc Create new order
// @route POST/api/order
// @access  Private

const addOrderItems = (asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
    }
    else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined

            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice

        })

        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
}

))




// @desc Get logged in user orders
// @route GET/api/orders/myorders
// @access  Private

const getMyOrders = (asyncHandler(async (req, res) => {
    //ordenes asociadas a un usuario en especifio
    const orders = await Order.find({ user: req.user._id })
    if (orders) {
        res.status(200).json(orders)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }

}))

// @desc Get order by Id
// @route GET/api/orders/:id/pay
// @access  Private

const getOrderById = (asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (order) {
        res.status(200).json(order)
    }
    else {
        res.status(404).json({
            message: 'Order not found'
        })
    }

}))

// @desc update order to paid
// @route PUT/api/orders/:id/pay
// @access  Private / admin

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id : req.body.id,
            status : req.body.status,
            update_time : req.body.update_time,
            email_address : req.body.email_address
        }
        const updatedOrder = await order.save()
        res.status(200).json(updatedOrder)

    } else{
        res.status(404)
        throw new Error ('Order not Found')
    }


})

// @desc update order to delivered
// @route PUT/api/orders/:id
// @access  Private / admin


const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order){
        order.isDelivered = true
        order.deliveredAt = Date.now()
        const updatedOrder = await order.save()
        res.status(200).json(updatedOrder)
    } else {
        res.status(404)
        throw new Error ('Order not Found')
    }
})

// @desc GET all orders
// @route GET/api/orders/
// @access  Private / admin

const getAllOrders = asyncHandler(async (req, res) => {
    const pageNumber = Number(req.query.pageNumber) || 1
    const pageSize = 5
    const count = await Order.countDocuments()
    const skip = (pageNumber - 1) * pageSize
    const orders = await Order.find({}).populate('user', 'name email').limit(pageSize).skip(skip)
    const pages = Math.ceil( count / pageSize)
    return res.status(200).json({ orders, pages, page : pageNumber })
})


export { addOrderItems, updateOrderToPaid, getMyOrders, getOrderById, updateOrderToDelivered, getAllOrders }