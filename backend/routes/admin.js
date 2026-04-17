const express = require('express');
const router = express.Router();
const Decision = require('../models/Decision');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/admin/dashboard - Overview stats
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const [totalDecisions, approved, rejected, review, flagged, totalUsers, customers, recentDecisions, consentViolations] = await Promise.all([
      Decision.countDocuments(),
      Decision.countDocuments({ 'trustCard.decision': 'approved' }),
      Decision.countDocuments({ 'trustCard.decision': 'rejected' }),
      Decision.countDocuments({ 'trustCard.decision': 'review' }),
      Decision.countDocuments({ status: 'flagged' }),
      User.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Decision.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email'),
      Decision.countDocuments({ 'trustCard.consentValidated': false })
    ]);

    // Fairness stats
    const fairnessAgg = await Decision.aggregate([
      { $group: { _id: null, avgFairness: { $avg: '$trustCard.fairnessScore' }, avgConfidence: { $avg: '$trustCard.confidenceScore' } } }
    ]);

    // Decisions over last 7 days
    const last7Days = await Decision.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, approved: { $sum: { $cond: [{ $eq: ['$trustCard.decision', 'approved'] }, 1, 0] } }, rejected: { $sum: { $cond: [{ $eq: ['$trustCard.decision', 'rejected'] }, 1, 0] } } } },
      { $sort: { _id: 1 } }
    ]);

    // Bias distribution
    const biasAgg = await Decision.aggregate([
      { $group: { _id: null, avgGenderBias: { $avg: '$biasAnalysis.genderBias' }, avgAgeBias: { $avg: '$biasAnalysis.ageBias' }, avgIncomeBias: { $avg: '$biasAnalysis.incomeBias' } } }
    ]);

    res.json({
      success: true,
      data: {
        decisions: { total: totalDecisions, approved, rejected, review, flagged },
        users: { total: totalUsers, customers },
        fairness: fairnessAgg[0] || { avgFairness: 0, avgConfidence: 0 },
        recentDecisions,
        last7Days,
        bias: biasAgg[0] || {},
        consentViolations
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @GET /api/admin/decisions - All decisions
router.get('/decisions', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, decision } = req.query;
    const query = {};
    if (status) query.status = status;
    if (decision) query['trustCard.decision'] = decision;

    const decisions = await Decision.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Decision.countDocuments(query);
    res.json({ success: true, data: decisions, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @PUT /api/admin/decisions/:id/review - Review a decision
router.put('/decisions/:id/review', protect, authorize('admin'), async (req, res) => {
  try {
    const { reviewNotes } = req.body;
    const decision = await Decision.findOneAndUpdate(
      { decisionId: req.params.id },
      { isReviewed: true, reviewNotes, reviewedBy: req.user.id, status: 'reviewed' },
      { new: true }
    );
    if (!decision) return res.status(404).json({ success: false, error: 'Decision not found' });
    res.json({ success: true, data: decision });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @GET /api/admin/users - All users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
