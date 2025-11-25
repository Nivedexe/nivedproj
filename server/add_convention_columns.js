import db from './config/db.js';

const addColumns = async () => {
    try {
        await db.authenticate();
        console.log('Database connected...');

        // Add maxCapacity column
        try {
            await db.query(`ALTER TABLE Conventions ADD COLUMN maxCapacity INTEGER DEFAULT 100;`);
            console.log('Added maxCapacity column.');
        } catch (err) {
            console.log('maxCapacity column might already exist or error:', err.message);
        }

        // Add registeredCount column
        try {
            await db.query(`ALTER TABLE Conventions ADD COLUMN registeredCount INTEGER DEFAULT 0;`);
            console.log('Added registeredCount column.');
        } catch (err) {
            console.log('registeredCount column might already exist or error:', err.message);
        }

        process.exit();
    } catch (err) {
        console.error('Error updating database:', err);
        process.exit(1);
    }
};

addColumns();
