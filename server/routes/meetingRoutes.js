import express from 'express';
import { createMeeting, getMeetings, updateMeeting, deleteMeeting, getMeetingById } from '../controllers/meetingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getMeetings)
    .post(protect, admin, createMeeting);

router.route('/:id')
    .get(protect, admin, getMeetingById)
    .put(protect, admin, updateMeeting)
    .delete(protect, admin, deleteMeeting);

export default router;
