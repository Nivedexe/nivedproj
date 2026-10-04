import dotenv from 'dotenv';
import db from '../config/db.js';
import { Test } from '../models/index.js';

dotenv.config();
dotenv.config({ path: '../.env' });

const cleanupAssessment = async () => {
    try {
        console.log('Connecting to the database...');
        await db.authenticate();
        
        console.log('Removing old assessments...');
        
        // Remove the original 'Initial Recovery Checkup' test
        const deletedRows = await Test.destroy({
            where: {
                title: 'Initial Recovery Checkup'
            }
        });

        console.log(`Deleted ${deletedRows} old assessment(s).`);
        console.log('=================================');
        console.log('✅ Old assessment successfully removed from database!');
        console.log('=================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error cleaning up assessments:', error);
        process.exit(1);
    }
};

cleanupAssessment();
