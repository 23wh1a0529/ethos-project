const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/audit/my - User's own audit trail
router.get('/my', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const logs = await AuditLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await AuditLog.countDocuments({ userId: req.user.id });
    res.json({ success: true, data: logs, total });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @GET /api/audit/all - Admin: all audit logs
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, severity, action } = req.query;
    const query = {};
    if (severity) query.severity = severity;
    if (action) query.action = action;

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await AuditLog.countDocuments(query);
    res.json({ success: true, data: logs, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
