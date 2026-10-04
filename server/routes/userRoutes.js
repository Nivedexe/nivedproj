import express from 'express';
import { 
    getAllUsers, 
    createUser, 
    getUsersByGroup, 
    updateUserGroup,
    approveUser,
    rejectUser
} from '../controllers/userController.js';
import { protect, admin, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, staff, getAllUsers)
    .post(protect, admin, createUser);

router.route('/:id/approve')
    .put(protect, admin, approveUser);

router.route('/:id/reject')
    .put(protect, admin, rejectUser);

// Volunteer routes to view group members
router.route('/group/:groupName')
    .get(protect, getUsersByGroup);

// Assign a user to a group 
router.route('/:id/group')
    .put(protect, admin, updateUserGroup);

export default router;
