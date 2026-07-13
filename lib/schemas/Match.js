import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['liked', 'super_liked', 'viewed', 'accepted', 'rejected', 'blocked'],
      default: 'viewed',
      index: true,
    },
    message: {
      type: String,
      maxlength: 300,
      default: null,
    },
    connectionDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
matchSchema.index({ senderId: 1, recipientId: 1 });
matchSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Match || mongoose.model('Match', matchSchema);
