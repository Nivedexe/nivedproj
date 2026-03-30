import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const ConventionRegistration = db.define('ConventionRegistration', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    memberCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    roomType: {
        type: DataTypes.STRING,
        defaultValue: 'Single'
    },
    foodPreference: {
        type: DataTypes.ENUM('Veg', 'Non-Veg', 'Vegan', 'Buffet'),
        defaultValue: 'Veg'
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    }
});

export default ConventionRegistration;
