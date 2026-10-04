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
    hotelName: DataTypes.STRING,
    hotelDetails: DataTypes.TEXT,
    roomTariffs: {
        type: DataTypes.TEXT,
        defaultValue: '{"Single": 1000, "Double AC": 2000, "Non-AC": 1500}',
        get() {
            const rawValue = this.getDataValue('roomTariffs');
            if (typeof rawValue === 'object') return rawValue;
            try {
                return rawValue ? JSON.parse(rawValue) : (typeof this.defaultValue === 'string' ? JSON.parse(this.defaultValue) : null);
            } catch (e) {
                console.error('Error parsing roomTariffs JSON:', rawValue);
                return {};
            }
        },
        set(value) {
            const stringValue = (typeof value === 'object' && value !== null)
                ? JSON.stringify(value)
                : value;
            this.setDataValue('roomTariffs', stringValue);
        }
    },
    maxCapacity: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    registeredCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'approved'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

export default Convention;
