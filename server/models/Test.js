import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Test = db.define('Test', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: DataTypes.TEXT,
    criteria: DataTypes.TEXT,
    questions: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('questions');
            if (typeof rawValue === 'object') return rawValue;
            try {
                return rawValue ? JSON.parse(rawValue) : null;
            } catch (e) {
                console.error('Error parsing questions JSON:', rawValue);
                return null;
            }
        },
        set(value) {
            const stringValue = (typeof value === 'object' && value !== null)
                ? JSON.stringify(value)
                : value;
            this.setDataValue('questions', stringValue);
        }
    },
    scoringLogic: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('scoringLogic');
            if (typeof rawValue === 'object') return rawValue;
            try {
                return rawValue ? JSON.parse(rawValue) : null;
            } catch (e) {
                console.error('Error parsing scoringLogic JSON:', rawValue);
                return null;
            }
        },
        set(value) {
            const stringValue = (typeof value === 'object' && value !== null)
                ? JSON.stringify(value)
                : value;
            this.setDataValue('scoringLogic', stringValue);
        }
    }
});

export default Test;
