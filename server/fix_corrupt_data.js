import { Test, TestResult, Convention } from './models/index.js';
import db from './config/db.js';

async function fixCorruptData() {
    try {
        await db.authenticate();
        console.log('Database connected...');

        const tests = await Test.findAll();
        for (const test of tests) {
            let changed = false;
            // The getter now returns null if parsing fails, but lets check raw values if possible
            // Actually, we can just check if they are null but had data
            const rawQuestions = test.getDataValue('questions');
            const rawScoring = test.getDataValue('scoringLogic');

            if (rawQuestions === '[object Object]') {
                console.log(`Fixing corrupted questions for Test ID: ${test.id}`);
                test.setDataValue('questions', null);
                changed = true;
            }
            if (rawScoring === '[object Object]') {
                console.log(`Fixing corrupted scoringLogic for Test ID: ${test.id}`);
                test.setDataValue('scoringLogic', null);
                changed = true;
            }
            if (changed) await test.save();
        }

        const results = await TestResult.findAll();
        for (const res of results) {
            let changed = false;
            if (res.getDataValue('answers') === '[object Object]') {
                res.setDataValue('answers', '[]');
                changed = true;
            }
            if (res.getDataValue('resultBand') === '[object Object]') {
                res.setDataValue('resultBand', '{}');
                changed = true;
            }
            if (changed) await res.save();
        }

        console.log('Data repair complete.');
        process.exit(0);
    } catch (error) {
        console.error('Repair failed:', error);
        process.exit(1);
    }
}

fixCorruptData();
