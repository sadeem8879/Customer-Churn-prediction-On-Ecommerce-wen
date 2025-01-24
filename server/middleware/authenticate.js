// File: middleware/authenticate.js
import jwt from 'jsonwebtoken';
import prisma from "../database/db.js";
import "dotenv/config";

const JWT_SECRET = process.env.SECRET_KEY;

export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: 'Token required' });
  }

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Find the user using the decoded token's user id
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach the user object to the request for later use
    next(); // Proceed to the next middleware or route handler
  });
};

