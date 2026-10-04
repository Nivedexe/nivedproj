import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

export const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const whereClause = role ? { role } : {};
        const users = await User.findAll({
            where: whereClause,
            attributes: ['id', 'username', 'email', 'role', 'groupName', 'isApproved']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUsersByGroup = async (req, res) => {
    try {
        const { groupName } = req.params;
        const users = await User.findAll({
            where: { groupName, role: 'tippler' },
            attributes: ['id', 'username', 'email', 'isApproved', 'phone', 'sobrietyDate']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateUserGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { groupName } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.groupName = groupName;
        await user.save();

        res.json({ message: 'User group updated successfully', user: { id: user.id, username: user.username, groupName: user.groupName } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'tippler'
        });

        res.status(201).json({ message: 'User created successfully', user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isApproved = true;
        await user.save();
        res.json({ message: 'User approved successfully', user: { id: user.id, username: user.username, isApproved: user.isApproved } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const rejectUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User rejected and removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
