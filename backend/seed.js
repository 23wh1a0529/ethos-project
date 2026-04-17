/**
 * ETHOS Database Seeder
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Decision = require('./models/Decision');
const AuditLog = require('./models/AuditLog');
const { processDecision } = require('./services/ethosEngine');
const { v4: uuidv4 } = require('uuid');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ethos';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing
  await User.deleteMany({});
  await Decision.deleteMany({});
  await AuditLog.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create admin
  const admin = await User.create({
    name: 'Admin Officer',
    email: 'admin@ethos.com',
    password: 'admin123',
    role: 'admin',
    annualIncome: 2000000,
    employmentStatus: 'employed',
    creditScore: 800
  });
  console.log('✅ Admin created:', admin.email);

  // Create demo customer
  const customer = await User.create({
    name: 'Arjun Sharma',
    email: 'demo@ethos.com',
    password: 'demo123',
    role: 'customer',
    phone: '+91 98765 43210',
    annualIncome: 720000,
    employmentStatus: 'employed',
    creditScore: 720,
    consentPreferences: {
      financialData: true, employmentData: true, locationData: false,
      behavioralData: false, creditHistory: true, personalData: true
    }
  });
  console.log('✅ Customer created:', customer.email);

  // Create 2 more customers
  const customers = await User.create([
    {
      name: 'Priya Nair',
      email: 'priya@test.com', password: 'test123', role: 'customer',
      annualIncome: 540000, creditScore: 680, employmentStatus: 'employed'
    },
    {
      name: 'Ravi Kumar',
      email: 'ravi@test.com', password: 'test123', role: 'customer',
      annualIncome: 360000, creditScore: 590, employmentStatus: 'self-employed'
    }
  ]);

  // Seed decisions for demo customer
  const sampleApps = [
    { loanAmount: 500000, loanPurpose: 'home', loanTerm: 84, annualIncome: 720000, employmentStatus: 'employed', yearsEmployed: 4, creditScore: 720, debtToIncomeRatio: 0.22, creditUtilization: 0.28, paymentHistory: 'good', existingLoans: 1 },
    { loanAmount: 150000, loanPurpose: 'vehicle', loanTerm: 36, annualIncome: 720000, employmentStatus: 'employed', yearsEmployed: 4, creditScore: 720, debtToIncomeRatio: 0.3, creditUtilization: 0.4, paymentHistory: 'good', existingLoans: 2 },
    { loanAmount: 1200000, loanPurpose: 'personal', loanTerm: 60, annualIncome: 720000, employmentStatus: 'employed', yearsEmployed: 4, creditScore: 720, debtToIncomeRatio: 0.6, creditUtilization: 0.75, paymentHistory: 'fair', existingLoans: 3 },
  ];

  for (const appData of sampleApps) {
    const result = await processDecision(customer._id, 'loan', appData, customer);
    await Decision.create({ ...result, userId: customer._id, applicationType: 'loan', applicationData: appData });
    await AuditLog.create({
      logId: uuidv4(), decisionId: result.decisionId, userId: customer._id,
      action: 'decision_processed', outcome: result.trustCard.decision,
      fairnessScore: result.trustCard.fairnessScore,
      consentStatus: result.trustCard.consentValidated ? 'valid' : 'violated',
      riskFlags: result.trustCard.riskFlags,
      severity: result.trustCard.riskFlags.length > 0 ? 'high' : 'low',
      metadata: { applicationType: 'loan' }
    });
  }

  // Login logs
  await AuditLog.create([
    { logId: uuidv4(), userId: customer._id, action: 'user_login', outcome: 'success', severity: 'low' },
    { logId: uuidv4(), userId: admin._id, action: 'user_login', outcome: 'success', severity: 'low' },
    { logId: uuidv4(), userId: customer._id, action: 'consent_updated', outcome: 'success', severity: 'medium', metadata: { updated: true } }
  ]);

  console.log('✅ Seeded decisions and audit logs');
  console.log('\n🎉 Seed complete!\n');
  console.log('Login credentials:');
  console.log('  Admin:    admin@ethos.com / admin123');
  console.log('  Customer: demo@ethos.com  / demo123\n');

  await mongoose.disconnect();
}

seed().catch(err => { console.error('❌ Seed error:', err); process.exit(1); });
