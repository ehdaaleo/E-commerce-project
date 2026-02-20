import Order from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        const populatedItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product)
                    throw new Error(`Product not found: ${item.product}`);
                return {
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                };
            })
        );

        const totalAmount = populatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            orderNumber: `ORD-${uuidv4().slice(0, 8)}`,
            user: req.user.id,
            items: populatedItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            orderStatus: 'pending',
            paymentStatus: 'pending',
            isPaid: false,
        });

        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort(
            '-createdAt'
        );
        res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: 'Order not found' });

        if (
            order.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res
                .status(403)
                .json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: 'Order not found' });
        if (order.user.toString() !== req.user.id)
            return res
                .status(403)
                .json({ success: false, message: 'Not authorized' });
        if (order.orderStatus !== 'pending')
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage',
            });

        order.orderStatus = 'cancelled';
        await order.save();

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort('-createdAt');
        res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: 'Order not found' });

        order.orderStatus = status;
        await order.save();

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update payment status (Admin only)
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: 'Order not found' });

        order.paymentStatus = paymentStatus;
        await order.save();

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
