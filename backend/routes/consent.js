const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// @GET /api/consent - Get consent preferences
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('consentPreferences');
    res.json({ success: true, data: user.consentPreferences });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @PUT /api/consent - Update consent preferences
router.put('/', protect, async (req, res) => {
  try {
    const { financialData, employmentData, locationData, behavioralData, creditHistory, personalData } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        consentPreferences: {
          financialData: financialData ?? true,
          employmentData: employmentData ?? true,
          locationData: locationData ?? false,
          behavioralData: behavioralData ?? false,
          creditHistory: creditHistory ?? true,
          personalData: personalData ?? true
        }
      },
      { new: true }
    );

    await AuditLog.create({
      logId: uuidv4(), userId: req.user.id, action: 'consent_updated',
      outcome: 'success', severity: 'medium',
      metadata: { updatedPreferences: req.body }
    });

    res.json({ success: true, data: user.consentPreferences });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
