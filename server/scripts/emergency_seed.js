import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
dotenv.config({ path: '../.env' });

async function run() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'Mysql@2025',
            database: process.env.DB_NAME || 'erehab_db'
        });

        const email = 'admin@erehab.com';
        const password = 'adminpassword123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Delete existing if any
        await connection.execute('DELETE FROM Users WHERE email = ?', [email]);

        await connection.execute(
            'INSERT INTO Users (username, email, password, role, isApproved, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            ['admin', email, hash, 'admin', 1]
        );

        fs.writeFileSync('final_status.txt', 'SUCCESS: Admin user created in MySQL directly.');
        await connection.end();
    } catch (err) {
        fs.writeFileSync('final_status.txt', 'FAILURE: ' + err.message);
    }
}

run();
