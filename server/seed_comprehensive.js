import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db from './config/db.js';
import { User, Meeting, Convention, Test, ConventionRegistration, Payment, Feedback, Newsletter } from './models/index.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('Connecting to the database...');
        await db.authenticate();

        console.log('Dropping all tables and re-syncing schema (force: true)...');
        await db.sync({ force: true });

        // 1. Seed Users
        console.log('Seeding Users...');
        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('adminpassword123', salt);
        const userHash = await bcrypt.hash('password123', salt);

        const admin = await User.create({
            username: 'admin',
            email: 'admin@erehab.com',
            password: adminHash,
            role: 'admin',
            isApproved: true,
            firstName: 'System',
            lastName: 'Administrator',
        });

        const volunteer1 = await User.create({
            username: 'john_volunteer',
            email: 'john.v@example.com',
            password: userHash,
            role: 'volunteer',
            isApproved: true,
            firstName: 'John',
            lastName: 'Doe',
            phone: '555-0101',
            sobrietyDate: '2015-05-15'
        });

        const volunteer2 = await User.create({
            username: 'sarah_hope',
            email: 'sarah.h@example.com',
            password: userHash,
            role: 'volunteer',
            isApproved: true,
            firstName: 'Sarah',
            lastName: 'Hope',
            phone: '555-0102',
            sobrietyDate: '2018-11-20'
        });

        const tippler1 = await User.create({
            username: 'mike_t',
            email: 'mike.t@example.com',
            password: userHash,
            role: 'tippler',
            isApproved: true,
            firstName: 'Mike',
            lastName: 'T',
            phone: '555-0201',
            sobrietyDate: '2023-01-10'
        });

        const tippler2 = await User.create({
            username: 'linda_recovery',
            email: 'linda.r@example.com',
            password: userHash,
            role: 'tippler',
            isApproved: true,
            firstName: 'Linda',
            lastName: 'R',
            phone: '555-0202',
            sobrietyDate: '2022-06-05'
        });

        const newTippler = await User.create({
            username: 'newcomer_alex',
            email: 'alex.n@example.com',
            password: userHash,
            role: 'tippler',
            isApproved: false, // Needs approval
            firstName: 'Alex',
            lastName: 'N',
            phone: '555-0203'
        });

        // 2. Seed Meetings
        console.log('Seeding Meetings...');
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const meeting1 = await Meeting.create({
            title: 'Morning Reflections',
            groupName: 'Early Risers Group',
            description: 'A daily morning meeting to start the day with focus and intention. Open discussion.',
            dateTime: tomorrow, // Future meeting
            link: 'https://zoom.us/j/123456789',
            type: 'Open'
        });

        const meeting2 = await Meeting.create({
            title: 'Steps 1-3 Study',
            groupName: 'Foundation Builders',
            description: 'In-depth study of the first three steps. Closed meeting for those with a desire to stop drinking.',
            dateTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            link: 'https://zoom.us/j/987654321',
            type: 'Closed'
        });

        const pastMeeting = await Meeting.create({
            title: 'Weekend Speaker Meeting',
            groupName: 'Saturday Night Live',
            description: 'Guest speaker sharing their experience, strength, and hope.',
            dateTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            link: 'https://zoom.us/j/112233445',
            type: 'Open'
        });

        // Assign users to meetings
        await meeting1.addUsers([volunteer1, tippler1, tippler2]);
        await meeting2.addUsers([volunteer2, tippler1]);

        // 3. Seed Conventions
        console.log('Seeding Conventions...');
        const convStartDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        const convEndDate = new Date(convStartDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days long

        const convention1 = await Convention.create({
            name: 'Annual Serenity Conference 2026',
            location: 'Portland, Oregon',
            startDate: convStartDate,
            endDate: convEndDate,
            description: 'Join us for three days of fellowship, inspiring speakers, and workshops tailored to all stages of recovery.',
            tariff: 150.00,
            hotelName: 'Grand Portland Hotel',
            hotelDetails: 'A beautiful hotel downtown. Amenities include a pool, fitness center, and complimentary breakfast.',
            roomTariffs: '{"Single": 120, "Double AC": 180, "Non-AC": 100}',
            maxCapacity: 500,
            registeredCount: 3
        });

        const convention2 = await Convention.create({
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
        });

        const convention3 = await Convention.create({
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
        });

        const convention4 = await Convention.create({
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
        });

        // 4. Seed Convention Registrations & Payments
        console.log('Seeding Convention Registrations...');

        // Tippler 1 registers
        await ConventionRegistration.create({
            UserId: tippler1.id,
            ConventionId: convention1.id,
            memberCount: 1,
            roomType: 'Single',
            foodPreference: 'Veg',
            totalAmount: 270.00 // 150 (tariff) + 120 (Single room)
        });
        await Payment.create({
            amount: 270.00,
            status: 'completed',
            paymentMethod: 'Credit Card',
            transactionId: 'TXN-1001',
            UserId: tippler1.id,
            ConventionId: convention1.id
        });

        // Volunteer 1 registers (bringing a guest)
        await ConventionRegistration.create({
            UserId: volunteer1.id,
            ConventionId: convention1.id,
            memberCount: 2,
            roomType: 'Double AC',
            foodPreference: 'Non-Veg',
            totalAmount: 480.00 // (150 * 2) + 180 (Double AC)
        });
        await Payment.create({
            amount: 480.00,
            status: 'completed',
            paymentMethod: 'PayPal',
            transactionId: 'TXN-1002',
            UserId: volunteer1.id,
            ConventionId: convention1.id
        });

        // 5. Seed Assessments (Tests)
        console.log('Seeding Assessments...');

        await Test.create({
            title: 'Clinical AUDIT-Style Assessment',
            description: 'A clinically inspired 10-question assessment to evaluate your drinking habits and associated risks.',
            criteria: 'Answer all 10 questions honestly to receive a clinically inspired risk evaluation.',
            questions: JSON.stringify([
                { id: 1, text: "How often do you drink alcohol?", type: "single-choice", options: [{ text: "Never", score: 0 }, { text: "Monthly or less", score: 1 }, { text: "2–4 times a month", score: 2 }, { text: "2–3 times a week", score: 3 }, { text: "4+ times a week", score: 4 }] },
                { id: 2, text: "How many drinks do you have on a typical day?", type: "single-choice", options: [{ text: "1–2", score: 0 }, { text: "3–4", score: 1 }, { text: "5–6", score: 2 }, { text: "7–9", score: 3 }, { text: "10+", score: 4 }] },
                { id: 3, text: "How often do you drink more than 6 drinks on one occasion?", type: "single-choice", options: [{ text: "Never", score: 0 }, { text: "Less than monthly", score: 1 }, { text: "Monthly", score: 2 }, { text: "Weekly", score: 3 }, { text: "Daily or almost daily", score: 4 }] },
                { id: 4, text: "How often do you feel unable to stop drinking once you start?", type: "single-choice", options: [{ text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 }] },
                { id: 5, text: "How often has drinking affected your responsibilities (work/home)?", type: "single-choice", options: [{ text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 }] },
                { id: 6, text: "How often do you need a drink in the morning (eye-opener)?", type: "single-choice", options: [{ text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 }] },
                { id: 7, text: "How often do you feel guilty after drinking?", type: "single-choice", options: [{ text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 }] },
                { id: 8, text: "Have you experienced memory loss after drinking?", type: "single-choice", options: [{ text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 }] },
                { id: 9, text: "Have others suggested you reduce your drinking?", type: "single-choice", options: [{ text: "No", score: 0 }, { text: "Once", score: 1 }, { text: "Occasionally", score: 2 }, { text: "Frequently", score: 3 }, { text: "Very often", score: 4 }] },
                { id: 10, text: "Have you had health or emotional issues due to drinking?", type: "single-choice", options: [{ text: "No", score: 0 }, { text: "Minor", score: 1 }, { text: "Moderate", score: 2 }, { text: "Serious", score: 3 }, { text: "Severe", score: 4 }] }
            ]),
            scoringLogic: JSON.stringify({
                calculation: "total / 4",
                thresholds: [
                    { maxScore: 2, message: "Low Risk" },
                    { maxScore: 4, message: "Mild Risk" },
                    { maxScore: 6, message: "Moderate Risk" },
                    { maxScore: 8, message: "High Risk" },
                    { maxScore: 10, message: "Severe Addiction (Immediate Attention Required)" }
                ]
            })
        });

        // 6. Seed Feedback
        console.log('Seeding Feedback...');
        await Feedback.create({
            rating: 5,
            message: 'The online meetings have been a lifesaver for me since I live in a rural area.',
            UserId: tippler1.id
        });
        await Feedback.create({
            rating: 4,
            message: 'Great platform, but I wish there were more afternoon meetings.',
            UserId: tippler2.id
        });
        await Feedback.create({
            rating: 5,
            message: 'This community has given me so much hope. The self-assessment tool was truly eye-opening.',
        }); // Anonymous
        await Feedback.create({
            rating: 3,
            message: 'The convention registration was slightly confusing at first, but overall a great experience.',
            UserId: newTippler.id
        });
        await Feedback.create({
            rating: 5,
            message: 'Absolutely love the volunteers here. Every meeting is managed professionally but with so much care.',
            UserId: volunteer2.id
        });
        await Feedback.create({
            rating: 4,
            message: 'Good resource for keeping track of my sobriety. Would love more frequent local events though.',
        }); // Anonymous
        await Feedback.create({
            rating: 5,
            message: 'Thank you E-REHAB! The workshops have been a cornerstone of my early recovery.',
            UserId: tippler1.id
        });

        // 7. Seed Newsletter Subscribers
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
            await Newsletter.create(sub);
        }

        console.log('=================================');
        console.log('✅ Database seeded successfully!');
        console.log('Admin Login: admin@erehab.com / adminpassword123');
        console.log('Tippler Login: mike.t@example.com / password123');
        console.log('Volunteer Login: john.v@example.com / password123');
        console.log('=================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
