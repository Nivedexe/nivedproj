import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Payment = db.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
    },
    paymentMethod: DataTypes.STRING,
    transactionId: DataTypes.STRING
});

export default Payment;
