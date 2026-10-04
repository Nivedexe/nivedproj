import express from 'express';
import { 
    createTest, 
    getTests, 
    getTestById, 
    updateTest, 
    deleteTest, 
    submitTestResult, 
    getTestResults, 
    getMyLatestTestResult,
    evaluateTestResult,
    approveTestEdit,
    rejectTestEdit
} from '../controllers/testController.js';
import { protect, admin, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getTests)
    .post(protect, admin, createTest);

router.route('/my-result')
    .get(protect, getMyLatestTestResult);

router.route('/results')
    .get(protect, admin, getTestResults);

router.route('/:id/submit')
    .post(protect, submitTestResult);

router.route('/results/:resultId/evaluate')
    .put(protect, admin, evaluateTestResult);

router.route('/:id/approve-edit')
    .put(protect, admin, approveTestEdit);

router.route('/:id/reject-edit')
    .put(protect, admin, rejectTestEdit);

router.route('/:id')
    .get(protect, getTestById)
    .put(protect, staff, updateTest)
    .delete(protect, admin, deleteTest);

export default router;
