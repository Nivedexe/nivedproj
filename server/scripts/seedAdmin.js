import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/index.js';
import db from '../config/db.js';

dotenv.config();
dotenv.config({ path: '../.env' });

const seedAdmin = async () => {
    try {
        await db.authenticate();
        await db.sync(); // Ensure tables are created

        const email = 'admin@erehab.com';
        const password = 'adminpassword123';
        const username = 'admin';

        const existingAdmin = await User.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('Admin already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin',
            isApproved: true
        });

        console.log('Admin user created successfully!\nEmail: ' + email + '\nPassword: ' + password);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin: ' + error.message);
        process.exit(1);
    }
};

seedAdmin();
