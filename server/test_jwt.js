import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;
console.log('JWT_SECRET:', secret);

if (!secret) {
    console.error('ERROR: JWT_SECRET is undefined');
    process.exit(1);
}

const payload = { id: 1, role: 'admin' };
const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log('Signed Token:', token);

try {
    const decoded = jwt.verify(token, secret);
    console.log('Decoded Payload:', decoded);
    console.log('SUCCESS: Token verified correctly');
} catch (err) {
    console.error('FAILURE:', err.message);
}
