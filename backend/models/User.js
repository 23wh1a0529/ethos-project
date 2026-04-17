const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  employmentStatus: { type: String, enum: ['employed', 'self-employed', 'unemployed', 'retired'], default: 'employed' },
  annualIncome: { type: Number, default: 0 },
  creditScore: { type: Number, default: 650, min: 300, max: 850 },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  consentPreferences: {
    financialData: { type: Boolean, default: true },
    employmentData: { type: Boolean, default: true },
    locationData: { type: Boolean, default: false },
    behavioralData: { type: Boolean, default: false },
    creditHistory: { type: Boolean, default: true },
    personalData: { type: Boolean, default: true }
  },
  lastLogin: { type: Date }
}, { timestamps: true });

// Hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

module.exports = mongoose.model('User', UserSchema);
