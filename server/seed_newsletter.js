import dotenv from 'dotenv';
import db from './config/db.js';
import { Newsletter } from './models/index.js';

dotenv.config();

const seedNewsletter = async () => {
    try {
        console.log('Connecting to the database...');
        await db.authenticate();
        
        console.log('Syncing Newsletter table...');
        await Newsletter.sync(); 
        
        console.log('Seeding Newsletter Subscribers...');
        const dummySubscribers = [
            { email: 'john.doe@example.com' },
            { email: 'jane.smith@example.com' },
            { email: 'daily.reader@test.org' },
            { email: 'health.update123@domain.com' },
            { email: 'community.member@local.net' },
            { email: 'recovery.journey@support.com' },
            { email: 'wellness.tips@guide.org' },
            { email: 'sobriety.first@network.com' },
            { email: 'hope.renewed@clinic.org' },
            { email: 'future.bright@ahead.com' }
        ];

        for (const sub of dummySubscribers) {
            const [record, created] = await Newsletter.findOrCreate({
                where: { email: sub.email },
                defaults: sub
            });
            if (created) {
                console.log(`Added: ${sub.email}`);
            } else {
                console.log(`Already exists: ${sub.email}`);
            }
        }

        console.log('=================================');
        console.log('✅ Newsletter Subscribers seeded successfully!');
        console.log('=================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding Newsletter Subscribers:', error);
        process.exit(1);
    }
};

seedNewsletter();
