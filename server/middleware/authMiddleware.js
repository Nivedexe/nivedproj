import jwt from 'jsonwebtoken';
import fs from 'fs';

export const protect = (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trimLeft();
    }

    try {
        if (!process.env.JWT_SECRET) {
            fs.appendFileSync('jwt_err.log', `[${new Date().toISOString()}] ERROR: JWT_SECRET is not defined\n`);
            return res.status(500).json({ message: 'Server configuration error' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        fs.appendFileSync('jwt_err.log', `[${new Date().toISOString()}] VERIFY ERROR: ${error.message} (Secret exists: ${!!process.env.JWT_SECRET}) (Token length: ${token?.length})\n`);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export const optionalAuth = (req, res, next) => {
    let token = req.header('Authorization');
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trimLeft();
        try {
            if (process.env.JWT_SECRET) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
            }
        } catch (error) {}
    }
    next();
};

export const staff = (req, res, next) => {
    // Both admin and volunteer can view feedbacks
    if (req.user && (req.user.role === 'admin' || req.user.role === 'volunteer')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as staff' });
    }
};
