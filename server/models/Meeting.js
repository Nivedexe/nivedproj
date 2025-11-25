import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Meeting = db.define('Meeting', {
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
    dateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    link: DataTypes.STRING,
    type: {
        type: DataTypes.ENUM('Open', 'Closed'),
        defaultValue: 'Open'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    }
});

export default Meeting;
