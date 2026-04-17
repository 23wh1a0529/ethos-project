const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { runAIModel } = require('../services/ethosEngine');

// @POST /api/ai/predict - Direct AI model prediction (for testing)
router.post('/predict', protect, async (req, res) => {
  try {
    const result = runAIModel(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Model prediction failed' });
  }
});

module.exports = router;
