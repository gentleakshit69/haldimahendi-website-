import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    supabaseId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['admin', 'premium', 'regular'],
      default: 'regular',
    },
    membershipTier: {
      type: String,
      enum: ['free', 'silver', 'gold', 'platinum'],
      default: 'free',
    },
    membershipExpiry: {
      type: Date,
      default: null,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reportedBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        reason: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for frequently searched fields
userSchema.index({ role: 1 });
userSchema.index({ membershipTier: 1 });
userSchema.index({ isActive: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);
