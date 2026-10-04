import express from 'express';
import { 
    createConvention, 
    getConventions, 
    updateConvention, 
    deleteConvention, 
    getConventionById, 
    registerForConvention, 
    getAllRegistrations,
    approveConvention,
    rejectConvention
} from '../controllers/conventionController.js';
import { protect, staff, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/registrations')
    .get(protect, staff, getAllRegistrations);

router.route('/')
    .get(protect, getConventions)
    .post(protect, staff, createConvention);

router.route('/:id/approve')
    .put(protect, admin, approveConvention);

router.route('/:id/reject')
    .put(protect, admin, rejectConvention);

router.route('/:id')
    .get(protect, staff, getConventionById)
    .put(protect, staff, updateConvention)
    .delete(protect, staff, deleteConvention);

router.route('/:id/register')
    .post(protect, registerForConvention);

export default router;
