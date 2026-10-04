import { Meeting } from '../models/index.js';

export const ensureBasicMeetings = async () => {
    try {
        console.log('Verifying 3 Basic Daily Recovery Meetings...');

        const basicMeetingsData = [
            {
                slot: 'morning',
                title: 'Morning Reflections & Hope',
                groupName: 'Early Birds Fellowship',
                description: 'Start your day with morning reflections, serenity readings, and open recovery sharing. Open to all fellowship members.',
                dateTime: new Date(new Date().setHours(8, 0, 0, 0)),
                link: 'https://meet.jit.si/erehab-morning-fellowship',
                type: 'Open',
                price: 0,
                isBasic: true
            },
            {
                slot: 'noon',
                title: 'Midday Serenity & Step Study',
                groupName: 'Noon Harmony Circle',
                description: 'Midday check-in to manage cravings, refocus your day, and discuss practical recovery tools. Open to all fellowship members.',
                dateTime: new Date(new Date().setHours(13, 0, 0, 0)),
                link: 'https://meet.jit.si/erehab-midday-serenity',
                type: 'Open',
                price: 0,
                isBasic: true
            },
            {
                slot: 'evening',
                title: 'Evening Gratitude & Night Owls',
                groupName: 'Sunset Sobriety Circle',
                description: 'Evening wrap-up and gratitude session. Share your victories, challenges, and support one another before the night ends. Open to all fellowship members.',
                dateTime: new Date(new Date().setHours(19, 30, 0, 0)),
                link: 'https://meet.jit.si/erehab-evening-gratitude',
                type: 'Open',
                price: 0,
                isBasic: true
            }
        ];

        for (const mData of basicMeetingsData) {
            const existing = await Meeting.findOne({
                where: {
                    slot: mData.slot
                }
            });

            if (existing) {
                await existing.update({
                    title: mData.title,
                    groupName: mData.groupName,
                    description: mData.description,
                    link: mData.link,
                    type: mData.type,
                    price: mData.price,
                    isBasic: true,
                    slot: mData.slot
                });
                console.log(`Updated basic meeting: [${mData.slot}] ${mData.title}`);
            } else {
                await Meeting.create(mData);
                console.log(`Created basic meeting: [${mData.slot}] ${mData.title}`);
            }
        }

        console.log('✅ 3 Basic Daily Recovery Meetings are active and verified.');
    } catch (err) {
        console.error('Error ensuring basic meetings:', err.message);
    }
};

// If run directly:
if (process.argv[1] && process.argv[1].includes('init_basic_meetings.js')) {
    import('../config/db.js').then(async ({ default: db }) => {
        await db.authenticate();
        await db.sync();
        await ensureBasicMeetings();
        process.exit(0);
    });
}
