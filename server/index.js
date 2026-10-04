import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { DataTypes } from 'sequelize';
import db from './config/db.js';
import { User, Meeting, Convention, Test, Payment, TestResult, Newsletter } from './models/index.js';

import authRoutes from './routes/authRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import conventionRoutes from './routes/conventionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testRoutes from './routes/testRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import { ensureBasicMeetings } from './utils/init_basic_meetings.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/conventions', conventionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/newsletters', newsletterRoutes);

app.get('/', (req, res) => {
    res.send('E-REHAB API is running');
});

const initDb = async () => {
    try {
        await db.authenticate();
        console.log('Database connected...');
        await db.sync();

        // Manual Schema Repair for missing columns
        const queryInterface = db.getQueryInterface();
        const tableMeeting = await queryInterface.describeTable('Meetings');
        if (!tableMeeting.groupName) {
            await queryInterface.addColumn('Meetings', 'groupName', { type: DataTypes.STRING, allowNull: true });
            console.log('Added groupName column to Meetings');
        }
        if (tableMeeting.isBasic === undefined) {
            await queryInterface.addColumn('Meetings', 'isBasic', { type: DataTypes.BOOLEAN, defaultValue: false });
            console.log('Added isBasic column to Meetings');
        }
        if (!tableMeeting.slot) {
            await queryInterface.addColumn('Meetings', 'slot', { type: DataTypes.STRING, allowNull: true });
            console.log('Added slot column to Meetings');
        }

        const tableConv = await queryInterface.describeTable('Conventions');
        if (!tableConv.hotelName) {
            await queryInterface.addColumn('Conventions', 'hotelName', { type: DataTypes.STRING, allowNull: true });
            console.log('Added hotelName column to Conventions');
        }
        if (!tableConv.hotelDetails) {
            await queryInterface.addColumn('Conventions', 'hotelDetails', { type: DataTypes.TEXT, allowNull: true });
            console.log('Added hotelDetails column to Conventions');
        }
        if (!tableConv.roomTariffs) {
            await queryInterface.addColumn('Conventions', 'roomTariffs', { type: DataTypes.TEXT, allowNull: true });
            console.log('Added roomTariffs column to Conventions');
        }
        if (tableConv.isApproved === undefined) {
            await queryInterface.addColumn('Conventions', 'isApproved', { type: DataTypes.BOOLEAN, defaultValue: true });
            console.log('Added isApproved column to Conventions');
        }
        if (!tableConv.status) {
            await queryInterface.addColumn('Conventions', 'status', { type: DataTypes.STRING, defaultValue: 'approved' });
            console.log('Added status column to Conventions');
        }
        if (!tableConv.createdBy) {
            await queryInterface.addColumn('Conventions', 'createdBy', { type: DataTypes.INTEGER, allowNull: true });
            console.log('Added createdBy column to Conventions');
        }

        const tableTests = await queryInterface.describeTable('Tests');
        if (tableTests.hasPendingReview === undefined) {
            await queryInterface.addColumn('Tests', 'hasPendingReview', { type: DataTypes.BOOLEAN, defaultValue: false });
            console.log('Added hasPendingReview column to Tests');
        }
        if (!tableTests.pendingChanges) {
            await queryInterface.addColumn('Tests', 'pendingChanges', { type: DataTypes.TEXT, allowNull: true });
            console.log('Added pendingChanges column to Tests');
        }

        console.log('Database synced and schema verified...');
        await ensureBasicMeetings();
    } catch (err) {
        console.log('Error connecting to database or syncing schema.');
        console.log(err.message);
    }
};

initDb();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
