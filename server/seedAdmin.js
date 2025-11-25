import bcrypt from 'bcryptjs';
import { User } from './models/index.js';
import db from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    try {
        await db.authenticate();
        console.log('Database connected...');

        const email = 'admin@gmail.com';
        const password = 'pass-admin@123';
        const username = 'Admin';

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin user created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
