import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import { User, Meeting, Convention, Test, Payment } from './models/index.js';

import authRoutes from './routes/authRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import conventionRoutes from './routes/conventionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testRoutes from './routes/testRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

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

app.get('/', (req, res) => {
    res.send('E-REHAB API is running');
});

const initDb = async () => {
    try {
        await db.authenticate();
        console.log('Database connected...');
        await db.sync();
        console.log('Database synced...');
    } catch (err) {
        console.log('Error connecting to database. Make sure MySQL is running and .env is configured.');
        console.log(err.message);
    }
};

initDb();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
