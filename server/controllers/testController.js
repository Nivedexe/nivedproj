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

        await test.update({ title, description, criteria, questions, scoringLogic });
        res.json(test);
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

        // Auto-approve users with low scores if desired, or leave it for manual admin approval.
        // For E-REHAB, admin manually reviews `test_ans` via `evaluation_test` to activate `Membership`.

        res.status(201).json({ message: 'Test submitted successfully', result });
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
