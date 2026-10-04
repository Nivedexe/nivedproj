import dotenv from 'dotenv';
import db from '../config/db.js';
import { Test } from '../models/index.js';

dotenv.config();
dotenv.config({ path: '../.env' });

const seedAssessment = async () => {
    try {
        console.log('Connecting to the database...');
        await db.authenticate();

        console.log('Syncing Test table...');
        await Test.sync();

        console.log('Seeding CLINICAL SUBSTANCE USE RISK Assessment...');

        const questions = [
            {
                id: 1,
                text: "Which substance do you use most often or are you currently seeking help for?",
                type: "single-choice",
                options: [
                    { text: "Alcohol", score: 0 },
                    { text: "Cigarettes / Tobacco / Nicotine", score: 0 },
                    { text: "Cannabis / Marijuana", score: 0 },
                    { text: "Opioids / Painkillers", score: 0 },
                    { text: "Stimulants (Cocaine / Amphetamines)", score: 0 },
                    { text: "Sedatives / Sleeping Pills", score: 0 },
                    { text: "Inhalants / Other Chemical Drugs", score: 0 },
                    { text: "Other Substance", score: 0 }
                ]
            },
            {
                id: 2,
                text: "How often do you use the selected substance?",
                type: "single-choice",
                options: [
                    { text: "Never / Not currently", score: 0 },
                    { text: "Less than monthly", score: 1 },
                    { text: "Monthly", score: 2 },
                    { text: "Weekly", score: 3 },
                    { text: "Daily or almost daily", score: 4 }
                ]
            },
            {
                id: 3,
                text: "How much or how intensely do you typically use the selected substance?",
                type: "single-choice",
                options: [
                    { text: "Very little / Low use", score: 0 },
                    { text: "Low", score: 1 },
                    { text: "Moderate", score: 2 },
                    { text: "High", score: 3 },
                    { text: "Very high / Heavy use", score: 4 }
                ]
            },
            {
                id: 4,
                text: "How often do you feel unable to stop using the substance once you start?",
                type: "single-choice",
                options: [
                    { text: "Never", score: 0 },
                    { text: "Rarely", score: 1 },
                    { text: "Sometimes", score: 2 },
                    { text: "Often", score: 3 },
                    { text: "Always", score: 4 }
                ]
            },
            {
                id: 5,
                text: "How often do you experience a strong craving or urge to use the substance?",
                type: "single-choice",
                options: [
                    { text: "Never", score: 0 },
                    { text: "Rarely", score: 1 },
                    { text: "Sometimes", score: 2 },
                    { text: "Often", score: 3 },
                    { text: "Always", score: 4 }
                ]
            },
            {
                id: 6,
                text: "How often do you experience withdrawal symptoms or feel that you need the substance to feel normal?",
                type: "single-choice",
                options: [
                    { text: "Never", score: 0 },
                    { text: "Rarely", score: 1 },
                    { text: "Sometimes", score: 2 },
                    { text: "Often", score: 3 },
                    { text: "Always", score: 4 }
                ]
            },
            {
                id: 7,
                text: "How often has substance use affected your responsibilities, work, studies, or relationships?",
                type: "single-choice",
                options: [
                    { text: "Never", score: 0 },
                    { text: "Rarely", score: 1 },
                    { text: "Sometimes", score: 2 },
                    { text: "Often", score: 3 },
                    { text: "Always", score: 4 }
                ]
            },
            {
                id: 8,
                text: "How often have you used the substance in situations that could put your health or safety at risk?",
                type: "single-choice",
                options: [
                    { text: "Never", score: 0 },
                    { text: "Rarely", score: 1 },
                    { text: "Sometimes", score: 2 },
                    { text: "Often", score: 3 },
                    { text: "Always", score: 4 }
                ]
            },
            {
                id: 9,
                text: "Have you experienced physical, health, or emotional problems because of substance use?",
                type: "single-choice",
                options: [
                    { text: "No", score: 0 },
                    { text: "Minor", score: 1 },
                    { text: "Moderate", score: 2 },
                    { text: "Serious", score: 3 },
                    { text: "Severe", score: 4 }
                ]
            },
            {
                id: 10,
                text: "Have you tried to reduce or stop using the substance but found it difficult to do so?",
                type: "single-choice",
                options: [
                    { text: "No", score: 0 },
                    { text: "Once", score: 1 },
                    { text: "Occasionally", score: 2 },
                    { text: "Frequently", score: 3 },
                    { text: "Very often / Unable to stop", score: 4 }
                ]
            }
        ];

        const scoringLogic = {
            calculation: "total / 3.6",
            thresholds: [
                { maxScore: 2, message: "Low Risk" },
                { maxScore: 4, message: "Mild Risk" },
                { maxScore: 6, message: "Moderate Risk" },
                { maxScore: 8, message: "High Risk" },
                {
                    maxScore: 10,
                    message: "Severe Risk (Immediate Professional Attention Recommended)"
                }
            ]
        };

        // Find existing test or create new one
        let assessment = await Test.findOne();
        if (assessment) {
            assessment.title = 'Clinical Substance Use Risk Assessment';
            assessment.description = 'A clinically inspired 10-question assessment to evaluate substance use patterns and associated risks.';
            assessment.criteria = 'Answer all 10 questions honestly to receive a clinically inspired substance-use risk evaluation.';
            assessment.questions = JSON.stringify(questions);
            assessment.scoringLogic = JSON.stringify(scoringLogic);
            assessment.hasPendingReview = false;
            assessment.pendingChanges = null;
            await assessment.save();
            console.log('✅ Clinical Substance Use Assessment UPDATED.');
        } else {
            assessment = await Test.create({
                title: 'Clinical Substance Use Risk Assessment',
                description: 'A clinically inspired 10-question assessment to evaluate substance use patterns and associated risks.',
                criteria: 'Answer all 10 questions honestly to receive a clinically inspired substance-use risk evaluation.',
                questions: JSON.stringify(questions),
                scoringLogic: JSON.stringify(scoringLogic)
            });
            console.log('✅ Clinical Substance Use Assessment CREATED.');
        }

        // Clean up any extraneous old AUDIT assessment tests if any exist
        await Test.destroy({
            where: {
                title: 'Clinical AUDIT-Style Assessment'
            }
        });

        console.log('=================================');
        console.log('✅ Successfully seeded the new Substance Use Risk Assessment!');
        console.log('=================================');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding Assessment:', error);
        process.exit(1);
    }
};

seedAssessment();
