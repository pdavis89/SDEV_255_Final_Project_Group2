const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const VALID_ROLES = ['professor', 'student'];

function createToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
  };
  return jwt.encode(payload, JWT_SECRET);
}

function parseToken(token) {
  if (!token) {
    throw new Error('No token provided');
  }
  return jwt.decode(token, JWT_SECRET);
}

function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  return scheme === 'Bearer' ? token : null;
}

function sanitizeUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(req, res) {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedRole = role && VALID_ROLES.includes(role) ? role : 'student';
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'A user with that email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name ? name.trim() : undefined,
      role: normalizedRole,
      status: 'online',
    });

    const token = createToken(user);
    res.status(201).json({ success: true, user: sanitizeUser(user), token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed.', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    user.status = 'online';
    await user.save();

    const token = createToken(user);
    res.json({ success: true, user: sanitizeUser(user), token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
  }
}

async function status(req, res) {
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

    res.json({ success: true, user: sanitizeUser(user), token });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.', error: error.message });
  }
}

async function logout(req, res) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization token is required.' });
    }

    const decoded = parseToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = 'offline';
    await user.save();

    res.json({ success: true, message: 'User logged out.', user: sanitizeUser(user) });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.', error: error.message });
  }
}

module.exports = {
  register,
  login,
  status,
  logout,
};
