import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Newsletter = db.define('Newsletter', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

export default Newsletter;
