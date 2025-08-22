import mongoose from 'mongoose';
import crypto from 'crypto';

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete expired tokens
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate a secure random token
passwordResetSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Check if token is valid and not expired
passwordResetSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date();
};

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;
