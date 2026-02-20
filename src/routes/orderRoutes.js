import express from 'express';
const router = express.Router();

// const {} = require('../controllers/orderController');

import {
    createOrder,
    getMyOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    updatePaymentStatus,
} from '../controllers/orderController.js';
import { auth, authorize } from '../middleware/auth.middleware.js';

router.use(auth);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.put('/:id/payment', authorize('admin'), updatePaymentStatus);

export default router;
