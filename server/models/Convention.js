import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Convention = db.define('Convention', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    description: DataTypes.TEXT,
    tariff: DataTypes.DECIMAL(10, 2),
    hotelDetails: DataTypes.TEXT,
    maxCapacity: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    registeredCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

export default Convention;
