import stripe from '../utils/paymentService.js';
import Order from '../models/Order.js';
import Payment from '../models/payment.model.js';
import Product from '../models/product.js';

export const createCheckoutSession = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.isPaid)
            return res.status(400).json({ message: 'Order already paid' });

        // Build the base URL dynamically from the request
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: order.items.map((item) => ({
                price_data: {
                    currency: 'egp',
                    product_data: { name: item.name },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/payment/cancel`,
            metadata: { orderId: order._id.toString() },
        });

        await Payment.create({
            order_id: order._id,
            user_id: order.user,
            method: order.paymentMethod,
            amount: order.totalAmount,
            stripeSessionId: session.id,
            status: 'pending',
        });
        console.log(session.id);
        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const success = async (req, res) => {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).send('No session ID');

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:4200';
    let order;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        const payment = await Payment.findOne({ stripeSessionId: session.id });
        if (!payment) return res.redirect(`${clientUrl}/payment/failed`);

        order = await Order.findById(payment.order_id);

        if (payment.status === 'pending' && session.payment_status === 'paid') {
            payment.status = 'completed';
            await payment.save();

            order.paymentStatus = 'paid';
            order.orderStatus = 'processing';
            order.isPaid = true;
            await order.save();

            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.product },
                    {
                        $inc: {
                            'inventory.quantity': -item.quantity,
                            soldCount: item.quantity,
                        },
                    }
                );
            }
        }

        // Redirect to the frontend success page
        res.redirect(`${clientUrl}/payment/success?order=${order.orderNumber}`);
    } catch (err) {
        console.error('Payment success error:', err);
        res.redirect(`${clientUrl}/payment/failed`);
    }
};
