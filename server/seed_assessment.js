import dotenv from 'dotenv';
import db from './config/db.js';
import { Test } from './models/index.js';

dotenv.config();

const seedAssessment = async () => {
    try {
        console.log('Connecting to the database...');
        await db.authenticate();
        
        console.log('Syncing Test table...');
        await Test.sync(); 
        
        console.log('Seeding CLINICAL AUDIT-STYLE Assessment...');
        const questions = [
            { id: 1, text: "How often do you drink alcohol?", type: "single-choice", options: [ { text: "Never", score: 0 }, { text: "Monthly or less", score: 1 }, { text: "2–4 times a month", score: 2 }, { text: "2–3 times a week", score: 3 }, { text: "4+ times a week", score: 4 } ] },
            { id: 2, text: "How many drinks do you have on a typical day?", type: "single-choice", options: [ { text: "1–2", score: 0 }, { text: "3–4", score: 1 }, { text: "5–6", score: 2 }, { text: "7–9", score: 3 }, { text: "10+", score: 4 } ] },
            { id: 3, text: "How often do you drink more than 6 drinks on one occasion?", type: "single-choice", options: [ { text: "Never", score: 0 }, { text: "Less than monthly", score: 1 }, { text: "Monthly", score: 2 }, { text: "Weekly", score: 3 }, { text: "Daily or almost daily", score: 4 } ] },
            { id: 4, text: "How often do you feel unable to stop drinking once you start?", type: "single-choice", options: [ { text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 } ] },
            { id: 5, text: "How often has drinking affected your responsibilities (work/home)?", type: "single-choice", options: [ { text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 } ] },
            { id: 6, text: "How often do you need a drink in the morning (eye-opener)?", type: "single-choice", options: [ { text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 } ] },
            { id: 7, text: "How often do you feel guilty after drinking?", type: "single-choice", options: [ { text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 } ] },
            { id: 8, text: "Have you experienced memory loss after drinking?", type: "single-choice", options: [ { text: "Never", score: 0 }, { text: "Rarely", score: 1 }, { text: "Sometimes", score: 2 }, { text: "Often", score: 3 }, { text: "Always", score: 4 } ] },
            { id: 9, text: "Have others suggested you reduce your drinking?", type: "single-choice", options: [ { text: "No", score: 0 }, { text: "Once", score: 1 }, { text: "Occasionally", score: 2 }, { text: "Frequently", score: 3 }, { text: "Very often", score: 4 } ] },
            { id: 10, text: "Have you had health or emotional issues due to drinking?", type: "single-choice", options: [ { text: "No", score: 0 }, { text: "Minor", score: 1 }, { text: "Moderate", score: 2 }, { text: "Serious", score: 3 }, { text: "Severe", score: 4 } ] }
        ];

        const scoringLogic = {
            calculation: "total / 4",
            thresholds: [
                { maxScore: 2, message: "Low Risk" },
                { maxScore: 4, "message": "Mild Risk" },
                { maxScore: 6, "message": "Moderate Risk" },
                { maxScore: 8, "message": "High Risk" },
                { maxScore: 10, "message": "Severe Addiction (Immediate Attention Required)" }
            ]
        };

        const [assessment, created] = await Test.findOrCreate({
            where: { title: 'Clinical AUDIT-Style Assessment' },
            defaults: {
                description: 'A clinically inspired 10-question assessment to evaluate your drinking habits and associated risks.',
                criteria: 'Answer all 10 questions honestly to receive a clinically inspired risk evaluation.',
                questions: JSON.stringify(questions),
                scoringLogic: JSON.stringify(scoringLogic)
            }
        });

        if (!created) {
            // Update it if it already exists
            assessment.questions = JSON.stringify(questions);
            assessment.scoringLogic = JSON.stringify(scoringLogic);
            await assessment.save();
            console.log('✅ Clinical Assessment UPDATED.');
        } else {
            console.log('✅ Clinical Assessment CREATED.');
        }

        console.log('=================================');
        console.log('✅ Successfully seeded the new AUDIT-style Assessment!');
        console.log('=================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding Assessment:', error);
        process.exit(1);
    }
};

seedAssessment();
