import { Feedback, User } from '../models/index.js';

export const createFeedback = async (req, res) => {
    try {
        const { message, rating } = req.body;
        const userId = req.user ? req.user.id : null;

        const feedback = await Feedback.create({
            UserId: userId,
            message,
            rating
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({
            include: [{
                model: User,
                attributes: ['username', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
