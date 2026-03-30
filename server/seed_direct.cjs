const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
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

    await connection.execute(
        'INSERT INTO Users (username, email, password, role, isApproved, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        ['admin', email, hash, 'admin', 1]
    );

    console.log('Admin created');
    await connection.end();
}

run().catch(console.error);
