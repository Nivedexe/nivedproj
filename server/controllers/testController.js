import { Test, TestResult, User } from '../models/index.js';

export const createTest = async (req, res) => {
    try {
        const { title, description, criteria, questions, scoringLogic } = req.body;
        const test = await Test.create({ title, description, criteria, questions, scoringLogic });
        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getTests = async (req, res) => {
    try {
        const tests = await Test.findAll();
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Test.findByPk(id);
        if (!test) return res.status(404).json({ message: 'Test not found' });
        res.json(test);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, criteria, questions, scoringLogic } = req.body;
        const test = await Test.findByPk(id);

        if (!test) return res.status(404).json({ message: 'Test not found' });

        if (req.user && req.user.role === 'volunteer') {
            // Volunteer edits: Do not overwrite live questions for Tipplers!
            // Save into pendingChanges and flag hasPendingReview: true
            const pendingData = {
                title,
                description,
                criteria,
                questions,
                scoringLogic,
                editedBy: req.user.username || req.user.email || 'Volunteer',
                editedAt: new Date()
            };
            await test.update({
                hasPendingReview: true,
                pendingChanges: JSON.stringify(pendingData)
            });
            return res.json({ 
                message: 'Assessment changes submitted for Admin approval. Live questions remain active for Tipplers until approved.',
                test 
            });
        }

        // Admin edits: Update directly and clear any pending flags
        await test.update({ 
            title, 
            description, 
            criteria, 
            questions, 
            scoringLogic,
            hasPendingReview: false,
            pendingChanges: null
        });
        res.json(test);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const approveTestEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Test.findByPk(id);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        if (!test.hasPendingReview || !test.pendingChanges) {
            return res.status(400).json({ message: 'No pending changes found for this assessment' });
        }

        const pending = typeof test.pendingChanges === 'string' ? JSON.parse(test.pendingChanges) : test.pendingChanges;
        await test.update({
            title: pending.title || test.title,
            description: pending.description || test.description,
            criteria: pending.criteria || test.criteria,
            questions: pending.questions || test.questions,
            scoringLogic: pending.scoringLogic || test.scoringLogic,
            hasPendingReview: false,
            pendingChanges: null
        });

        res.json({ message: 'Volunteer assessment changes approved and published live!', test });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const rejectTestEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Test.findByPk(id);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        await test.update({
            hasPendingReview: false,
            pendingChanges: null
        });

        res.json({ message: 'Pending assessment changes rejected and discarded.', test });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Test.findByPk(id);

        if (!test) return res.status(404).json({ message: 'Test not found' });

        await test.destroy();
        res.json({ message: 'Test deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const submitTestResult = async (req, res) => {
    try {
        const { id } = req.params; // Test ID
        const { answers, score, resultBand } = req.body;
        const userId = req.user.id; // Corrected

        const result = await TestResult.create({
            answers,
            score,
            resultBand,
            TestId: id,
            UserId: userId
        });

        // Once the tippler completes the assessment, activate their access to meetings, conventions, and dashboard
        const user = await User.findByPk(userId);
        if (user && user.role === 'tippler') {
            await user.update({ isApproved: true });
        }

        res.status(201).json({ message: 'Test submitted successfully', result, isApproved: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getTestResults = async (req, res) => {
    try {
        const results = await TestResult.findAll({
            include: [{ model: User, attributes: ['username', 'email'] }, { model: Test, attributes: ['title'] }]
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMyLatestTestResult = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await TestResult.findOne({
            where: { UserId: userId },
            order: [['createdAt', 'DESC']],
            include: [{ model: Test, attributes: ['id', 'title', 'description', 'criteria'] }]
        });
        res.json(result || null);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const evaluateTestResult = async (req, res) => {
    try {
        const { resultId } = req.params;
        const { isApproved, adminFeedback } = req.body;

        const result = await TestResult.findByPk(resultId, { include: User });
        if (!result) return res.status(404).json({ message: 'Test Result not found' });

        await result.update({ isEvaluated: true, adminFeedback });

        // Admin approves User Membership based on test
        if (isApproved && result.User) {
            await result.User.update({ isApproved: true });
        } else if (!isApproved && result.User) {
            await result.User.update({ isApproved: false });
        }

        res.json({ message: 'Test result evaluated and user membership updated', result });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
