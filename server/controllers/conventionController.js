import { Convention, ConventionRegistration, User } from '../models/index.js';

export const createConvention = async (req, res) => {
    try {
        const { name, location, startDate, endDate, description, tariff, hotelName, hotelDetails, roomTariffs, maxCapacity, coordinatorName, coordinatorPhone, mapLink } = req.body;
        const isVolunteer = req.user && req.user.role === 'volunteer';
        const isApproved = !isVolunteer; // Admin creations are auto-approved; volunteer creations require approval!
        const status = isApproved ? 'approved' : 'pending';

        const convention = await Convention.create({
            name,
            location,
            startDate,
            endDate,
            description,
            tariff: tariff || 0,
            hotelName,
            hotelDetails,
            mapLink,
            roomTariffs,
            maxCapacity: maxCapacity || 100,
            coordinatorName,
            coordinatorPhone,
            isApproved,
            status,
            createdBy: req.user ? req.user.id : null
        });

        res.status(201).json(convention);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getConventions = async (req, res) => {
    try {
        let whereClause = {};
        // If user is a tippler or not logged in, only return approved conventions
        if (!req.user || req.user.role === 'tippler') {
            whereClause = { isApproved: true };
        }

        const conventions = await Convention.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'email', 'phone', 'role']
                },
                {
                    model: ConventionRegistration,
                    attributes: ['id', 'UserId', 'memberCount', 'roomType', 'foodPreference', 'attendeeName', 'attendeePhone', 'totalAmount']
                }
            ],
            order: [['startDate', 'ASC']]
        });

        const enrichedConventions = conventions.map(conv => {
            const plain = conv.toJSON();
            const registrations = plain.ConventionRegistrations || [];

            // Distinct registered users count
            const uniqueUserIds = new Set(registrations.map(r => r.UserId));
            const registeredUsersCount = uniqueUserIds.size;

            // Total attendee members across all bookings
            const registeredAttendeesCount = registrations.reduce((sum, r) => sum + (Number(r.memberCount) || 1), 0);

            // Check if current user is already registered
            let isUserRegistered = false;
            let userRegistration = null;
            let userRegisteredCount = 0;

            if (req.user) {
                const userRegs = registrations.filter(r => r.UserId === req.user.id);
                if (userRegs.length > 0) {
                    isUserRegistered = true;
                    userRegisteredCount = userRegs.reduce((sum, r) => sum + (Number(r.memberCount) || 1), 0);
                    userRegistration = {
                        ...userRegs[userRegs.length - 1],
                        totalMembersRegistered: userRegisteredCount
                    };
                }
            }

            // Fallback coordinator details from creator volunteer
            const effectiveCoordinatorName = plain.coordinatorName || (plain.creator?.username ? plain.creator.username.toUpperCase() : 'JOHN_VOLUNTEER');
            const effectiveCoordinatorPhone = plain.coordinatorPhone || plain.creator?.phone || '+91 9876543210';

            return {
                ...plain,
                registeredCount: registeredAttendeesCount || plain.registeredCount,
                registeredUsersCount,
                registeredAttendeesCount: registeredAttendeesCount || plain.registeredCount,
                isUserRegistered,
                userRegistration,
                userRegisteredCount,
                coordinatorName: effectiveCoordinatorName,
                coordinatorPhone: effectiveCoordinatorPhone
            };
        });

        res.json(enrichedConventions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const approveConvention = async (req, res) => {
    try {
        const { id } = req.params;
        const convention = await Convention.findByPk(id);
        if (!convention) {
            return res.status(404).json({ message: 'Convention not found' });
        }
        await convention.update({ isApproved: true, status: 'approved' });
        res.json({ message: 'Convention approved successfully', convention });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const rejectConvention = async (req, res) => {
    try {
        const { id } = req.params;
        const convention = await Convention.findByPk(id);
        if (!convention) {
            return res.status(404).json({ message: 'Convention not found' });
        }
        await convention.destroy();
        res.json({ message: 'Convention rejected and removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getConventionById = async (req, res) => {
    try {
        const { id } = req.params;
        const convention = await Convention.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'email', 'phone', 'role']
                },
                {
                    model: ConventionRegistration,
                    attributes: ['id', 'UserId', 'memberCount', 'roomType', 'foodPreference', 'attendeeName', 'attendeePhone', 'totalAmount']
                }
            ]
        });

        if (!convention) {
            return res.status(404).json({ message: 'Convention not found' });
        }

        const plain = convention.toJSON();
        const registrations = plain.ConventionRegistrations || [];
        const uniqueUserIds = new Set(registrations.map(r => r.UserId));
        const registeredUsersCount = uniqueUserIds.size;
        const registeredAttendeesCount = registrations.reduce((sum, r) => sum + (Number(r.memberCount) || 1), 0);

        let isUserRegistered = false;
        let userRegistration = null;
        let userRegisteredCount = 0;

        if (req.user) {
            const userRegs = registrations.filter(r => r.UserId === req.user.id);
            if (userRegs.length > 0) {
                isUserRegistered = true;
                userRegisteredCount = userRegs.reduce((sum, r) => sum + (Number(r.memberCount) || 1), 0);
                userRegistration = {
                    ...userRegs[userRegs.length - 1],
                    totalMembersRegistered: userRegisteredCount
                };
            }
        }

        const effectiveCoordinatorName = plain.coordinatorName || (plain.creator?.username ? plain.creator.username.toUpperCase() : 'JOHN_VOLUNTEER');
        const effectiveCoordinatorPhone = plain.coordinatorPhone || plain.creator?.phone || '+91 9876543210';

        res.json({
            ...plain,
            registeredCount: registeredAttendeesCount || plain.registeredCount,
            registeredUsersCount,
            registeredAttendeesCount: registeredAttendeesCount || plain.registeredCount,
            isUserRegistered,
            userRegistration,
            userRegisteredCount,
            coordinatorName: effectiveCoordinatorName,
            coordinatorPhone: effectiveCoordinatorPhone
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateConvention = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, startDate, endDate, description, tariff, hotelName, hotelDetails, roomTariffs, maxCapacity, coordinatorName, coordinatorPhone, mapLink } = req.body;

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
            hotelName,
            hotelDetails,
            mapLink,
            roomTariffs,
            maxCapacity,
            coordinatorName,
            coordinatorPhone
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
        const { memberCount, foodPreference, roomType, totalAmount, attendeeName, attendeePhone, isAddMembers } = req.body;
        const userId = req.user.id;

        const convention = await Convention.findByPk(id);
        if (!convention) {
            return res.status(404).json({ message: 'Convention not found' });
        }

        const countToAdd = Number(memberCount) || 1;

        // Check capacity
        if (convention.registeredCount + countToAdd > convention.maxCapacity) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Check if user is already registered
        const existingRegistration = await ConventionRegistration.findOne({
            where: { UserId: userId, ConventionId: convention.id }
        });

        if (existingRegistration && !isAddMembers) {
            return res.status(400).json({
                message: 'You have already registered for this convention. Use "Add Members" if you wish to register additional people.',
                alreadyRegistered: true,
                existingRegistration
            });
        }

        let registration;
        if (existingRegistration && isAddMembers) {
            // Add additional members to existing registration
            existingRegistration.memberCount = (Number(existingRegistration.memberCount) || 1) + countToAdd;
            existingRegistration.totalAmount = Number(existingRegistration.totalAmount || 0) + Number(totalAmount || 0);
            if (attendeeName) existingRegistration.attendeeName = attendeeName;
            if (attendeePhone) existingRegistration.attendeePhone = attendeePhone;
            await existingRegistration.save();
            registration = existingRegistration;
        } else {
            // Create fresh registration
            registration = await ConventionRegistration.create({
                attendeeName,
                attendeePhone,
                memberCount: countToAdd,
                foodPreference: foodPreference || 'Veg',
                roomType: roomType || 'Single',
                totalAmount: totalAmount || 0,
                UserId: userId,
                ConventionId: convention.id
            });
        }

        // Update registered count
        await convention.increment('registeredCount', { by: countToAdd });

        res.status(201).json({
            message: isAddMembers ? 'Additional members added successfully!' : 'Registration successful',
            id: registration.id,
            totalAmount,
            registration,
            isAddMembers: !!isAddMembers
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await ConventionRegistration.findAll({
            include: [
                { model: User, attributes: ['id', 'username', 'email', 'phone'] },
                { model: Convention, attributes: ['id', 'name', 'startDate', 'coordinatorName', 'coordinatorPhone', 'maxCapacity', 'registeredCount'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

