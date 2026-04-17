const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
  name: String,
  value: mongoose.Schema.Types.Mixed,
  importance: Number,
  impact: { type: String, enum: ['positive', 'negative', 'neutral'] }
}, { _id: false });

const DecisionSchema = new mongoose.Schema({
  decisionId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicationType: { type: String, enum: ['loan', 'credit', 'fraud_check', 'risk_evaluation'], required: true },

  // Application details
  applicationData: {
    loanAmount: Number,
    loanPurpose: String,
    loanTerm: Number,
    annualIncome: Number,
    employmentStatus: String,
    creditScore: Number,
    debtToIncomeRatio: Number,
    creditUtilization: Number,
    paymentHistory: String,
    yearsEmployed: Number,
    existingLoans: Number
  },

  // AI Model output
  aiPrediction: {
    decision: { type: String, enum: ['approved', 'rejected', 'review'] },
    probability: Number,
    confidence: Number,
    modelVersion: { type: String, default: 'v1.0' }
  },

  // ETHOS processing
  trustCard: {
    decision: { type: String, enum: ['approved', 'rejected', 'review'] },
    confidenceScore: Number,
    fairnessScore: Number,
    explanation: String,
    keyFactors: [FeatureSchema],
    suggestions: [String],
    consentValidated: { type: Boolean, default: false },
    consentViolations: [String],
    riskFlags: [String]
  },

  // Governance
  biasAnalysis: {
    genderBias: Number,
    ageBias: Number,
    incomeBias: Number,
    overallBiasScore: Number,
    isFlagged: { type: Boolean, default: false }
  },

  status: { type: String, enum: ['pending', 'processed', 'flagged', 'reviewed'], default: 'pending' },
  processingTime: Number,
  isReviewed: { type: Boolean, default: false },
  reviewNotes: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

DecisionSchema.index({ userId: 1, createdAt: -1 });
DecisionSchema.index({ status: 1 });
DecisionSchema.index({ 'biasAnalysis.isFlagged': 1 });

module.exports = mongoose.model('Decision', DecisionSchema);
