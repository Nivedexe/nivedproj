import express from 'express';
import { createConvention, getConventions, updateConvention, deleteConvention, getConventionById, registerForConvention } from '../controllers/conventionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getConventions)
    .post(protect, admin, createConvention);

router.route('/:id')
    .get(protect, admin, getConventionById)
    .put(protect, admin, updateConvention)
    .delete(protect, admin, deleteConvention);

router.route('/:id/register')
    .post(protect, registerForConvention);

export default router;
