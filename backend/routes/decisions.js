const express = require('express');
const router = express.Router();
const Decision = require('../models/Decision');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { processDecision } = require('../services/ethosEngine');
const { v4: uuidv4 } = require('uuid');

// @POST /api/decisions/apply - Submit loan application
router.post('/apply', protect, async (req, res) => {
  try {
    const { applicationType, applicationData } = req.body;
    const user = await User.findById(req.user.id);

    // Run ETHOS processing pipeline
    const result = await processDecision(user._id, applicationType, applicationData, user);

    const decision = await Decision.create({
      ...result,
      userId: user._id,
      applicationType,
      applicationData
    });

    // Log it
    await AuditLog.create({
      logId: uuidv4(),
      decisionId: result.decisionId,
      userId: user._id,
      action: 'decision_processed',
      outcome: result.trustCard.decision,
      fairnessScore: result.trustCard.fairnessScore,
      consentStatus: result.trustCard.consentValidated ? 'valid' : 'violated',
      riskFlags: result.trustCard.riskFlags,
      severity: result.trustCard.riskFlags.length > 0 ? 'high' : 'low',
      metadata: { applicationType, processingTime: result.processingTime }
    });

    res.status(201).json({ success: true, data: decision });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Decision processing failed' });
  }
});

// @GET /api/decisions/my - Get user's own decisions
router.get('/my', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { userId: req.user.id };
    if (status) query.status = status;

    const decisions = await Decision.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Decision.countDocuments(query);
    res.json({ success: true, data: decisions, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @GET /api/decisions/:id - Get a single decision
router.get('/:id', protect, async (req, res) => {
  try {
    const decision = await Decision.findOne({
      decisionId: req.params.id,
      ...(req.user.role !== 'admin' && { userId: req.user.id })
    }).populate('userId', 'name email');

    if (!decision) return res.status(404).json({ success: false, error: 'Decision not found' });
    res.json({ success: true, data: decision });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @GET /api/decisions/stats/summary - User stats
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const [total, approved, rejected, review, flagged] = await Promise.all([
      Decision.countDocuments({ userId }),
      Decision.countDocuments({ userId, 'trustCard.decision': 'approved' }),
      Decision.countDocuments({ userId, 'trustCard.decision': 'rejected' }),
      Decision.countDocuments({ userId, 'trustCard.decision': 'review' }),
      Decision.countDocuments({ userId, status: 'flagged' })
    ]);

    const recent = await Decision.find({ userId }).sort({ createdAt: -1 }).limit(5).select('decisionId applicationType trustCard.decision trustCard.fairnessScore createdAt');
    res.json({ success: true, data: { total, approved, rejected, review, flagged, recent } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
