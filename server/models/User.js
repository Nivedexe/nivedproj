import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'tippler', 'volunteer'),
        defaultValue: 'tippler'
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    sobrietyDate: DataTypes.DATEONLY,
});

export default User;
