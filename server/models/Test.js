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
        type: DataTypes.JSON,
        allowNull: true
    },
    scoringLogic: {
        type: DataTypes.JSON,
        allowNull: true
    }
});

export default Test;
