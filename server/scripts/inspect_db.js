import mysql from 'mysql2/promise';
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

        const [rows] = await connection.execute('SELECT * FROM Tests');
        fs.writeFileSync('db_inspect.json', JSON.stringify(rows, null, 2));
        console.log('Inspect complete. Wrote to db_inspect.json');
        await connection.end();
    } catch (err) {
        fs.writeFileSync('db_inspect_error.txt', err.message);
    }
}

run();
