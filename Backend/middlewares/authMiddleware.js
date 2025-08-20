const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check if token is available in the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If no token is provided, return an Unauthorized response
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { _id: decoded.userId };

    next();
  } catch (err) {

    console.error('Error verifying token:', err);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
