const jwt = require('jwt-simple');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// gets the bearer token from the request header
function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  return scheme === 'Bearer' ? token : null;
}

// decodes the jwt token
function parseToken(token) {
  if (!token) {
    throw new Error('No token provided');
  }
  return jwt.decode(token, JWT_SECRET);
}

// finds the logged in user from the token
async function authenticate(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization token is required.' });
    }

    const decoded = parseToken(token);
    if (decoded.exp && decoded.exp < Date.now()) {
      return res.status(401).json({ success: false, message: 'Token has expired.' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.', error: error.message });
  }
}

// blocks users that do not have one of the allowed roles
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions.' });
    }

    next();
  };
}

module.exports = {
  authenticate,
  requireRole,
};
