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
            const numericIds = assignedUserIds.map(uid => parseInt(uid, 10)).filter(uid => !isNaN(uid));
            await meeting.setUsers(numericIds);
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

        if (role === 'admin' || role === 'volunteer') {
            meetings = await Meeting.findAll({ 
                include: User,
                order: [['isBasic', 'DESC'], ['dateTime', 'ASC']]
            });
        } else if (role === 'tippler') {
            // Tipplers see:
            // 1. All 3 basic daily fellowship meetings (isBasic === true)
            // 2. AND custom meetings specifically assigned to them
            const allMeetings = await Meeting.findAll({
                include: [{
                    model: User,
                    attributes: ['id', 'username'],
                    through: { attributes: [] }
                }],
                order: [['isBasic', 'DESC'], ['dateTime', 'ASC']]
            });

            meetings = allMeetings.filter(m => {
                if (m.isBasic) return true;
                return m.Users && m.Users.some(u => u.id === id);
            });
        } else {
            meetings = await Meeting.findAll({
                order: [['isBasic', 'DESC'], ['dateTime', 'ASC']]
            });
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
            const numericIds = Array.isArray(assignedUserIds)
                ? assignedUserIds.map(uid => parseInt(uid, 10)).filter(uid => !isNaN(uid))
                : [];
            await meeting.setUsers(numericIds);
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
