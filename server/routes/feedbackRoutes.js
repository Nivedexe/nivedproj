import express from 'express';
import { createFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { protect, optionalAuth, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(optionalAuth, createFeedback)
    .get(protect, staff, getAllFeedback);

export default router;
