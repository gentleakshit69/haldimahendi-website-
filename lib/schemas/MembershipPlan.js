import mongoose from 'mongoose';

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['free', 'silver', 'gold', 'platinum'],
      unique: true,
      required: true,
    },
    displayName: String,
    price: Number, // in rupees/dollars
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
    },
    features: {
      profileViews: Number,
      messageLimit: Number,
      likeLimit: Number,
      premiumFilters: Boolean,
      videoCall: Boolean,
      advancedMatching: Boolean,
      adFree: Boolean,
      profileBoosting: Boolean,
      prioritySupport: Boolean,
      blurredPhotos: Boolean, // Premium users see non-blurred
    },
    discount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.MembershipPlan || mongoose.model('MembershipPlan', membershipPlanSchema);
