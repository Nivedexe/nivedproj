import express from 'express';
import { subscribe, getSubscribers } from '../controllers/newsletterController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(subscribe)
    .get(protect, admin, getSubscribers);

export default router;
