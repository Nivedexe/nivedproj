import dotenv from 'dotenv';
import db from './config/db.js';
import { Convention } from './models/index.js';

dotenv.config();

const seedConventions = async () => {
    try {
        console.log('Connecting to the database...');
        await db.authenticate();
        
        console.log('Syncing Convention table...');
        await Convention.sync(); 
        
        console.log('Seeding Additional Conventions...');
        const now = new Date();
        const dummyConventions = [
            {
                name: 'Spring Renewal Retreat 2026',
                location: 'Sedona, Arizona',
                startDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 63 * 24 * 60 * 60 * 1000),
                description: 'A deeply restorative retreat in the heart of nature to help you connect with your inner peace and build long-lasting sobriety habits.',
                tariff: 250.00,
                hotelName: 'Red Rock Wellness Resort',
                hotelDetails: 'A secluded resort focusing on wellness. Includes yoga studio, organic meals, and spa access.',
                roomTariffs: '{"Single": 150, "Double": 220}',
                maxCapacity: 200,
                registeredCount: 0
            },
            {
                name: 'Steps to Freedom Workshop',
                location: 'Austin, Texas',
                startDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 92 * 24 * 60 * 60 * 1000),
                description: 'Intensive weekend workshop diving into the 12 steps. Great for newcomers and veterans looking to refresh their foundation.',
                tariff: 100.00,
                hotelName: 'Downtown Austin Inn',
                hotelDetails: 'Conveniently located downtown with easy access to city attractions. Includes basic amenities.',
                roomTariffs: '{"Single": 110, "Double AC": 160}',
                maxCapacity: 300,
                registeredCount: 0
            },
            {
                name: 'Winter Fellowship Gathering',
                location: 'Denver, Colorado',
                startDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 183 * 24 * 60 * 60 * 1000),
                description: 'Celebrate your recovery journey with a winter getaway. Includes keynote speakers, sober activities, and group discussions.',
                tariff: 180.00,
                hotelName: 'Snow Peak Lodge',
                hotelDetails: 'Beautiful mountain lodge. Amenities include indoor heated pool, fireplace lounge, and guided hikes.',
                roomTariffs: '{"Single": 140, "Double AC": 200}',
                maxCapacity: 400,
                registeredCount: 0
            }
        ];

        for (const conv of dummyConventions) {
            const [record, created] = await Convention.findOrCreate({
                where: { name: conv.name },
                defaults: conv
            });
            if (created) {
                console.log(`Added Convention: ${conv.name}`);
            } else {
                console.log(`Already exists: ${conv.name}`);
            }
        }

        console.log('=================================');
        console.log('✅ Additional Conventions seeded successfully!');
        console.log('=================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding Conventions:', error);
        process.exit(1);
    }
};

seedConventions();
