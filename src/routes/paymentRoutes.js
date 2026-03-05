import express from 'express';
import {
    createCheckoutSession,
    success,
} from '../controllers/paymentController.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Requires auth — user must be logged in to create a payment session
router.post('/checkout/create/:orderId', auth, createCheckoutSession);

// No auth — Stripe redirects the browser here after payment
router.get('/success', success);

// Cancel — Stripe redirects here if user cancels checkout
router.get('/cancel', (req, res) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:4200';
    res.redirect(`${clientUrl}/payment/cancel`);
});

export default router;
