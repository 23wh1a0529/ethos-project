const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      creditScore: user.creditScore,
      annualIncome: user.annualIncome,
      consentPreferences: user.consentPreferences
    }
  });
};

// @POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters'),
  body('role').optional().isIn(['customer', 'admin'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { name, email, password, role, phone, annualIncome, employmentStatus, creditScore } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, error: 'Email already registered' });

    const user = await User.create({
      name, email, password,
      role: role || 'customer',
      phone, annualIncome, employmentStatus, creditScore
    });

    await AuditLog.create({
      logId: uuidv4(), userId: user._id, action: 'user_register',
      outcome: 'success', severity: 'low',
      metadata: { email: user.email, role: user.role }
    });

    sendToken(user, 201, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @POST /api/auth/login
router.post('/login', [
  body('email').isEmail(), body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    user.lastLogin = new Date();
    await user.save();

    await AuditLog.create({
      logId: uuidv4(), userId: user._id, action: 'user_login',
      outcome: 'success', severity: 'low',
      ipAddress: req.ip
    });

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
});

// @PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address, annualIncome, employmentStatus, dateOfBirth } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id,
      { name, phone, address, annualIncome, employmentStatus, dateOfBirth },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
