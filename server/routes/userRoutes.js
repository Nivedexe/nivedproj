import express from 'express';
import { getAllUsers, createUser, getUsersByGroup, updateUserGroup } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getAllUsers)
    .post(protect, admin, createUser);

// Volunteer routes to view group members
router.route('/group/:groupName')
    .get(protect, getUsersByGroup);

// Assign a user to a group 
router.route('/:id/group')
    .put(protect, admin, updateUserGroup);

export default router;
