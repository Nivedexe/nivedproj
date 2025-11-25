import { Meeting, User } from '../models/index.js';

export const createMeeting = async (req, res) => {
    try {
        const { title, description, dateTime, link, type, price, assignedUserIds } = req.body;

        const meeting = await Meeting.create({
            title,
            description,
            dateTime,
            link,
            type,
            price: price || 0
        });

        if (assignedUserIds && assignedUserIds.length > 0) {
            await meeting.setUsers(assignedUserIds);
        }

        res.status(201).json(meeting);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMeetings = async (req, res) => {
    try {
        const { role, id } = req.user;
        let meetings;

        if (role === 'admin') {
            meetings = await Meeting.findAll({ include: User });
        } else {
            // For now, return all meetings for users to see paid ones too, or filter?
            // User requested "paid meetings where user needs to pay".
            // Let's return all meetings so they can see them.
            meetings = await Meeting.findAll();
        }

        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await Meeting.findByPk(id, { include: User });

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.json(meeting);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dateTime, link, type, price, assignedUserIds } = req.body;

        const meeting = await Meeting.findByPk(id);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        await meeting.update({ title, description, dateTime, link, type, price });

        if (assignedUserIds) {
            await meeting.setUsers(assignedUserIds);
        }

        res.json(meeting);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await Meeting.findByPk(id);

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        await meeting.destroy();
        res.json({ message: 'Meeting deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
