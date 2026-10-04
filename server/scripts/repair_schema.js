import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
dotenv.config({ path: '../.env' });

async function checkAndFixSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'Mysql@2025',
            database: process.env.DB_NAME || 'erehab_db'
        });

        console.log('Checking Meetings table...');
        const [meetingCols] = await connection.execute('DESCRIBE Meetings');
        const meetingColNames = meetingCols.map(c => c.Field);
        if (!meetingColNames.includes('groupName')) {
            console.log('Adding groupName to Meetings...');
            await connection.execute('ALTER TABLE Meetings ADD COLUMN groupName VARCHAR(255) AFTER title');
        }

        console.log('Checking Conventions table...');
        const [convCols] = await connection.execute('DESCRIBE Conventions');
        const convColNames = convCols.map(c => c.Field);
        if (!convColNames.includes('hotelName')) {
            console.log('Adding hotelName to Conventions...');
            await connection.execute('ALTER TABLE Conventions ADD COLUMN hotelName VARCHAR(255) AFTER tariff');
        }
        if (!convColNames.includes('hotelDetails')) {
            console.log('Adding hotelDetails to Conventions...');
            await connection.execute('ALTER TABLE Conventions ADD COLUMN hotelDetails TEXT AFTER hotelName');
        }
        if (!convColNames.includes('roomTariffs')) {
            console.log('Adding roomTariffs to Conventions...');
            await connection.execute('ALTER TABLE Conventions ADD COLUMN roomTariffs TEXT AFTER hotelDetails');
        }

        console.log('Schema repair complete.');
        await connection.end();
        fs.writeFileSync('schema_repair_status.txt', 'SUCCESS: Database schema updated correctly.');
    } catch (err) {
        console.error('Schema repair failed:', err);
        fs.writeFileSync('schema_repair_status.txt', 'FAILURE: ' + err.message);
    }
}

checkAndFixSchema();
