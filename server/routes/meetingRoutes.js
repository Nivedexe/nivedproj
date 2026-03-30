import express from 'express';
import { createMeeting, getMeetings, updateMeeting, deleteMeeting, getMeetingById } from '../controllers/meetingController.js';
import { protect, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getMeetings)
    .post(protect, staff, createMeeting);

router.route('/:id')
    .get(protect, staff, getMeetingById)
    .put(protect, staff, updateMeeting)
    .delete(protect, staff, deleteMeeting);

export default router;
