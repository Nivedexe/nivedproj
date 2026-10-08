import jwt from 'jsonwebtoken';

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
            console.error('ERROR: JWT_SECRET is not defined in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(`JWT Verification Error: ${error.message}`);
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
