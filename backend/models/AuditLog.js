const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  logId: { type: String, unique: true },
  decisionId: { type: String, ref: 'Decision' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: {
    type: String,
    enum: ['decision_created', 'decision_processed', 'consent_updated', 'decision_flagged', 'decision_reviewed', 'user_login', 'user_register', 'data_accessed'],
    required: true
  },
  outcome: { type: String, enum: ['approved', 'rejected', 'review', 'success', 'failure', 'flagged'] },
  fairnessScore: Number,
  consentStatus: { type: String, enum: ['valid', 'violated', 'partial', 'n/a'], default: 'n/a' },
  riskFlags: [String],
  ipAddress: String,
  userAgent: String,
  metadata: mongoose.Schema.Types.Mixed,
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' }
}, { timestamps: true });

AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ severity: 1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
