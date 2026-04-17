const { v4: uuidv4 } = require('uuid');

// Simulated ML model scoring
function runAIModel(data) {
  const {
    creditScore = 650, annualIncome = 50000, loanAmount = 10000,
    debtToIncomeRatio = 0.3, creditUtilization = 0.4,
    paymentHistory = 'good', yearsEmployed = 3,
    existingLoans = 1, employmentStatus = 'employed'
  } = data;

  let score = 0;

  // Credit score factor (0-35 pts)
  if (creditScore >= 750) score += 35;
  else if (creditScore >= 700) score += 28;
  else if (creditScore >= 650) score += 20;
  else if (creditScore >= 600) score += 12;
  else score += 5;

  // Income to loan ratio (0-25 pts)
  const incomeRatio = annualIncome / loanAmount;
  if (incomeRatio >= 5) score += 25;
  else if (incomeRatio >= 3) score += 18;
  else if (incomeRatio >= 2) score += 12;
  else if (incomeRatio >= 1) score += 6;
  else score += 0;

  // Debt to income (0-20 pts)
  if (debtToIncomeRatio <= 0.2) score += 20;
  else if (debtToIncomeRatio <= 0.35) score += 14;
  else if (debtToIncomeRatio <= 0.5) score += 8;
  else score += 2;

  // Credit utilization (0-10 pts)
  if (creditUtilization <= 0.3) score += 10;
  else if (creditUtilization <= 0.5) score += 6;
  else if (creditUtilization <= 0.7) score += 3;
  else score += 0;

  // Payment history (0-10 pts)
  const payMap = { excellent: 10, good: 7, fair: 4, poor: 1 };
  score += payMap[paymentHistory] || 4;

  // Employment (bonus/penalty)
  if (employmentStatus === 'employed' && yearsEmployed >= 2) score += 5;
  else if (employmentStatus === 'self-employed') score += 2;
  else if (employmentStatus === 'unemployed') score -= 10;

  // Existing loans
  if (existingLoans === 0) score += 5;
  else if (existingLoans >= 3) score -= 5;

  const probability = Math.min(Math.max(score / 100, 0.05), 0.98);
  let decision = 'rejected';
  if (probability >= 0.65) decision = 'approved';
  else if (probability >= 0.45) decision = 'review';

  return { decision, probability: parseFloat(probability.toFixed(3)), confidence: parseFloat((0.7 + Math.random() * 0.25).toFixed(3)), score, modelVersion: 'v2.1' };
}

// SHAP-like feature importance
function calculateFeatureImportance(data, prediction) {
  const features = [
    {
      name: 'Credit Score', value: data.creditScore,
      importance: data.creditScore >= 700 ? 0.82 : data.creditScore >= 600 ? 0.45 : -0.6,
      impact: data.creditScore >= 700 ? 'positive' : data.creditScore >= 600 ? 'neutral' : 'negative'
    },
    {
      name: 'Income-to-Loan Ratio', value: `${((data.annualIncome || 0) / (data.loanAmount || 1)).toFixed(2)}x`,
      importance: (data.annualIncome / data.loanAmount) >= 3 ? 0.75 : (data.annualIncome / data.loanAmount) >= 1.5 ? 0.3 : -0.5,
      impact: (data.annualIncome / data.loanAmount) >= 3 ? 'positive' : (data.annualIncome / data.loanAmount) >= 1.5 ? 'neutral' : 'negative'
    },
    {
      name: 'Debt-to-Income Ratio', value: `${((data.debtToIncomeRatio || 0.3) * 100).toFixed(0)}%`,
      importance: (data.debtToIncomeRatio || 0.3) <= 0.35 ? 0.6 : -0.55,
      impact: (data.debtToIncomeRatio || 0.3) <= 0.35 ? 'positive' : 'negative'
    },
    {
      name: 'Credit Utilization', value: `${((data.creditUtilization || 0.4) * 100).toFixed(0)}%`,
      importance: (data.creditUtilization || 0.4) <= 0.3 ? 0.5 : -0.4,
      impact: (data.creditUtilization || 0.4) <= 0.3 ? 'positive' : 'negative'
    },
    {
      name: 'Payment History', value: data.paymentHistory || 'good',
      importance: data.paymentHistory === 'excellent' ? 0.7 : data.paymentHistory === 'good' ? 0.4 : data.paymentHistory === 'fair' ? 0.1 : -0.6,
      impact: ['excellent', 'good'].includes(data.paymentHistory) ? 'positive' : 'negative'
    },
    {
      name: 'Employment Status', value: data.employmentStatus || 'employed',
      importance: data.employmentStatus === 'employed' ? 0.45 : data.employmentStatus === 'self-employed' ? 0.2 : -0.5,
      impact: data.employmentStatus === 'employed' ? 'positive' : data.employmentStatus === 'unemployed' ? 'negative' : 'neutral'
    }
  ];
  return features.sort((a, b) => Math.abs(b.importance) - Math.abs(a.importance));
}

// Generate natural language explanation
function generateExplanation(decision, features, data) {
  const negFactors = features.filter(f => f.impact === 'negative').map(f => f.name);
  const posFactors = features.filter(f => f.impact === 'positive').map(f => f.name);

  if (decision === 'approved') {
    return `Your loan application has been approved. The primary positive factors were: ${posFactors.slice(0, 2).join(' and ')}. Your financial profile demonstrates sufficient creditworthiness and repayment capacity.`;
  } else if (decision === 'rejected') {
    const reasons = negFactors.slice(0, 2).join(' and ');
    return `Your loan application could not be approved at this time. The main concerns are: ${reasons || 'insufficient creditworthiness'}. Addressing these factors may improve your chances in future applications.`;
  } else {
    return `Your application requires additional review. Some factors are positive while others need further assessment. A loan officer will review your application within 2-3 business days.`;
  }
}

// Generate improvement suggestions
function generateSuggestions(data, decision) {
  const suggestions = [];
  if (decision !== 'approved') {
    if ((data.creditScore || 650) < 700) suggestions.push('Improve your credit score by making timely payments on all existing debts');
    if ((data.creditUtilization || 0.4) > 0.3) suggestions.push('Reduce credit card utilization below 30% to positively impact your score');
    if ((data.debtToIncomeRatio || 0.3) > 0.35) suggestions.push('Pay down existing debts to lower your debt-to-income ratio');
    if ((data.annualIncome || 50000) / (data.loanAmount || 10000) < 3) suggestions.push('Consider applying for a smaller loan amount relative to your income');
    if (data.paymentHistory === 'poor' || data.paymentHistory === 'fair') suggestions.push('Establish a consistent on-time payment record for at least 6 months');
    if (data.employmentStatus === 'unemployed') suggestions.push('Secure stable employment before reapplying to demonstrate income stability');
  } else {
    suggestions.push('Maintain your current payment habits to preserve your excellent credit profile');
    suggestions.push('Keep credit utilization below 30% to maintain your credit score');
  }
  return suggestions;
}

// Bias analysis
function analyzeBias(data, prediction) {
  const scores = {
    genderBias: parseFloat((Math.random() * 0.12).toFixed(3)),
    ageBias: parseFloat((Math.random() * 0.08).toFixed(3)),
    incomeBias: parseFloat((Math.random() * 0.15).toFixed(3))
  };
  scores.overallBiasScore = parseFloat(((scores.genderBias + scores.ageBias + scores.incomeBias) / 3).toFixed(3));
  scores.isFlagged = scores.overallBiasScore > 0.1;
  return scores;
}

// Consent validation
function validateConsent(userData, applicationData) {
  const violations = [];
  const prefs = userData.consentPreferences || {};

  if (!prefs.financialData) violations.push('Financial transaction data used without consent');
  if (!prefs.employmentData && applicationData.employmentStatus) violations.push('Employment data used without consent');
  if (!prefs.creditHistory && applicationData.creditScore) violations.push('Credit history accessed without consent');

  return { isValid: violations.length === 0, violations };
}

// Main ETHOS processing pipeline
async function processDecision(userId, applicationType, applicationData, userData) {
  const startTime = Date.now();

  // Step 1: Run AI model
  const aiPrediction = runAIModel(applicationData);

  // Step 2: Feature importance (SHAP-like)
  const keyFactors = calculateFeatureImportance(applicationData, aiPrediction);

  // Step 3: Consent validation
  const consentResult = validateConsent(userData, applicationData);

  // Step 4: Bias analysis
  const biasAnalysis = analyzeBias(applicationData, aiPrediction);

  // Step 5: Fairness score
  const fairnessScore = parseFloat((1 - biasAnalysis.overallBiasScore).toFixed(3));

  // Step 6: Generate explanation
  const explanation = generateExplanation(aiPrediction.decision, keyFactors, applicationData);

  // Step 7: Suggestions
  const suggestions = generateSuggestions(applicationData, aiPrediction.decision);

  // Step 8: Risk flags
  const riskFlags = [];
  if (biasAnalysis.isFlagged) riskFlags.push('BIAS_DETECTED');
  if (!consentResult.isValid) riskFlags.push('CONSENT_VIOLATION');
  if (aiPrediction.confidence < 0.75) riskFlags.push('LOW_CONFIDENCE');

  const processingTime = Date.now() - startTime;

  return {
    decisionId: `ETH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    aiPrediction,
    trustCard: {
      decision: aiPrediction.decision,
      confidenceScore: aiPrediction.confidence,
      fairnessScore,
      explanation,
      keyFactors,
      suggestions,
      consentValidated: consentResult.isValid,
      consentViolations: consentResult.violations,
      riskFlags
    },
    biasAnalysis,
    status: riskFlags.length > 0 ? 'flagged' : 'processed',
    processingTime
  };
}

module.exports = { processDecision, runAIModel };
