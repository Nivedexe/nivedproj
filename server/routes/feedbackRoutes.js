import express from 'express';
import { createFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createFeedback)
    .get(protect, admin, getAllFeedback);

export default router;
