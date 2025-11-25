import { Test } from '../models/index.js';

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
