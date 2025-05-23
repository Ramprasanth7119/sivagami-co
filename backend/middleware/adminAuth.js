import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const adminAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.token;

        if (!authHeader) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided. Login Again' 
            });
        }

        // Clean and validate token
        const token = authHeader.replace('Bearer ', '').trim();

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token format' 
            });
        }

        console.log('Token:', token); // Debugging line

        console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debugging line

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Decoded token:', decoded); // Debugging line

        console.log(decoded);

        // Validate admin email
        if (decoded !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Not an admin.' 
            });
        }

        // Store decoded info and proceed
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default adminAuth;
