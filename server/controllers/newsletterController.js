import { Newsletter } from '../models/index.js';

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        const existing = await Newsletter.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        const subscription = await Newsletter.create({ email });
        res.status(201).json({ message: 'Subscribed successfully', subscription });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.findAll();
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
