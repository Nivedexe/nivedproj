import { Convention } from '../models/index.js';

export const createConvention = async (req, res) => {
    try {
        const { name, location, startDate, endDate, description, tariff, hotelDetails, maxCapacity } = req.body;

        const convention = await Convention.create({
            name,
            location,
            startDate,
            endDate,
            description,
            tariff,
            hotelDetails,
            maxCapacity: maxCapacity || 100
        });

        res.status(201).json(convention);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getConventions = async (req, res) => {
    try {
        const conventions = await Convention.findAll();
        res.json(conventions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getConventionById = async (req, res) => {
    try {
        const { id } = req.params;
        const convention = await Convention.findByPk(id);

        if (!convention) {
            return res.status(404).json({ message: 'Convention not found' });
        }

        res.json(convention);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateConvention = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, startDate, endDate, description, tariff, hotelDetails, maxCapacity } = req.body;

        const convention = await Convention.findByPk(id);
        if (!convention) {
            return res.status(404).json({ message: 'Convention not found' });
        }

        await convention.update({
            name,
            location,
            startDate,
            endDate,
            description,
            tariff,
            hotelDetails,
            maxCapacity
        });

        res.json(convention);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteConvention = async (req, res) => {
    try {
        const { id } = req.params;
        const convention = await Convention.findByPk(id);

        if (!convention) {
            return res.status(404).json({ message: 'Convention not found' });
        }

        await convention.destroy();
        res.json({ message: 'Convention deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const registerForConvention = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberCount, foodPreference } = req.body;
        const userId = req.user.id;

        const convention = await Convention.findByPk(id);
        if (!convention) {
            return res.status(404).json({ message: 'Convention not found' });
        }

        // Check capacity
        if (convention.registeredCount + memberCount > convention.maxCapacity) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        const totalAmount = convention.tariff * memberCount;

        // Create registration
        await convention.addUser(userId, {
            through: {
                memberCount,
                foodPreference,
                totalAmount
            }
        });

        // Update registered count
        await convention.increment('registeredCount', { by: memberCount });

        res.status(201).json({ message: 'Registration successful', totalAmount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
