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
        
        console.log('Seeding / Updating Conventions with Kerala & India locations...');
        const now = new Date();
        const dummyConventions = [
            {
                name: 'Annual Serenity Conference 2026',
                location: 'Kochi, Kerala',
                startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 33 * 24 * 60 * 60 * 1000),
                description: 'Join us for three days of fellowship, inspiring speakers, and workshops tailored to all stages of recovery along the serene backwaters of Kochi.',
                tariff: 150.00,
                hotelName: 'Grand Hyatt Kochi Bolgatty',
                hotelDetails: 'Luxury waterfront resort on Bolgatty Island, Kochi. Features serene backwater views, modern conference halls, wellness center, and Kerala traditional cuisine.',
                roomTariffs: '{"Single": 120, "Double AC": 180, "Non-AC": 100}',
                maxCapacity: 500
            },
            {
                name: 'Spring Renewal Retreat 2026',
                location: 'Munnar, Kerala',
                startDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 63 * 24 * 60 * 60 * 1000),
                description: 'A deeply restorative retreat in the heart of nature to help you connect with your inner peace and build long-lasting sobriety habits.',
                tariff: 250.00,
                hotelName: 'Tea County Hill Resort, Munnar',
                hotelDetails: 'A peaceful hill station retreat nestled amidst misty tea gardens in Munnar. Includes meditation pavilion, Ayurvedic wellness center, and guided nature walks.',
                roomTariffs: '{"Single": 150, "Double": 220}',
                maxCapacity: 200
            },
            {
                name: 'Steps to Freedom Workshop',
                location: 'Kovalam, Thiruvananthapuram',
                startDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 92 * 24 * 60 * 60 * 1000),
                description: 'Intensive weekend workshop diving into the 12 steps. Great for newcomers and veterans looking to refresh their foundation.',
                tariff: 100.00,
                hotelName: 'Kovalam Beach Wellness Resort',
                hotelDetails: 'Seaside resort located along Kovalam coastline. Amenities include air-conditioned conference facilities, beachside reflection spaces, and nutritious traditional dining.',
                roomTariffs: '{"Single": 110, "Double AC": 160}',
                maxCapacity: 300
            },
            {
                name: 'Winter Fellowship Gathering',
                location: 'Wayanad, Kerala',
                startDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
                endDate: new Date(now.getTime() + 183 * 24 * 60 * 60 * 1000),
                description: 'Celebrate your recovery journey with a winter getaway amidst misty hills. Includes keynote speakers, sober activities, and group discussions.',
                tariff: 180.00,
                hotelName: 'Vythiri Mist Eco-Resort, Wayanad',
                hotelDetails: 'Scenic rainforest eco-resort in the Western Ghats. Amenities include conference hall, campfire fellowship lounge, and guided nature trails.',
                roomTariffs: '{"Single": 140, "Double AC": 200}',
                maxCapacity: 400
            }
        ];

        for (const conv of dummyConventions) {
            const existing = await Convention.findOne({ where: { name: conv.name } });
            if (existing) {
                await existing.update(conv);
                console.log(`✅ Updated existing Convention with Kerala location: ${conv.name} (${conv.location})`);
            } else {
                await Convention.create({ ...conv, registeredCount: 0 });
                console.log(`➕ Created new Convention: ${conv.name} (${conv.location})`);
            }
        }

        console.log('=================================');
        console.log('✅ Conventions updated successfully in MySQL!');
        console.log('=================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding Conventions:', error);
        process.exit(1);
    }
};

seedConventions();
