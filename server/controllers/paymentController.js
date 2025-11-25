import { Payment, User, Convention } from '../models/index.js';

export const processPayment = async (req, res) => {
    try {
        const { conventionId, amount, paymentMethod } = req.body;
        const userId = req.user.id;

        // Mock Payment Processing
        // In a real app, we would integrate with Stripe/PayPal here.

        const payment = await Payment.create({
            amount,
            status: 'completed',
            paymentMethod,
            transactionId: 'MOCK-' + Date.now(),
            UserId: userId,
            ConventionId: conventionId
        });

        // Register User for Convention
        const convention = await Convention.findByPk(conventionId);
        const user = await User.findByPk(userId);

        if (convention && user) {
            await convention.addUser(user);
        }

        res.status(201).json({ success: true, payment, message: 'Registration successful' });
    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ message: 'Payment failed', error: error.message });
    }
};
