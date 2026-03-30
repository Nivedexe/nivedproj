import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const TestResult = db.define('TestResult', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    answers: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('answers');
            if (typeof rawValue === 'object') return rawValue;
            try {
                return rawValue ? JSON.parse(rawValue) : null;
            } catch (e) {
                console.error('Error parsing answers JSON:', rawValue);
                return null;
            }
        },
        set(value) {
            const stringValue = (typeof value === 'object' && value !== null)
                ? JSON.stringify(value)
                : value;
            this.setDataValue('answers', stringValue);
        }
    },
    score: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    resultBand: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('resultBand');
            if (typeof rawValue === 'object') return rawValue;
            try {
                return rawValue ? JSON.parse(rawValue) : null;
            } catch (e) {
                console.error('Error parsing resultBand JSON:', rawValue);
                return null;
            }
        },
        set(value) {
            const stringValue = (typeof value === 'object' && value !== null)
                ? JSON.stringify(value)
                : value;
            this.setDataValue('resultBand', stringValue);
        }
    },
    isEvaluated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    adminFeedback: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export default TestResult;
