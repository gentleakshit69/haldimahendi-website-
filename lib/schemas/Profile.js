import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    gallery: [
      {
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
      index: true,
    },
    lookingFor: {
      type: String,
      enum: ['male', 'female', 'anyone'],
      required: true,
    },
    religion: {
      type: String,
      default: null,
    },
    caste: {
      type: String,
      default: null,
    },
    location: {
      city: String,
      state: String,
      country: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
        },
      },
    },
    height: {
      type: Number, // in cm
      default: null,
    },
    weight: {
      type: Number, // in kg
      default: null,
    },
    bodyType: {
      type: String,
      enum: ['slim', 'average', 'athletic', 'heavy'],
      default: null,
    },
    education: {
      qualification: String,
      field: String,
      college: String,
    },
    occupation: {
      type: String,
      default: null,
    },
    income: {
      type: String,
      enum: ['not-disclosed', '<5L', '5L-10L', '10L-25L', '25L-50L', '>50L'],
      default: 'not-disclosed',
    },
    bio: {
      type: String,
      maxlength: 500,
      default: null,
    },
    interests: [String],
    languages: [String],
    maritalStatus: {
      type: String,
      enum: ['never-married', 'divorced', 'widowed', 'annulled'],
      default: 'never-married',
    },
    hasChildren: {
      type: Boolean,
      default: false,
    },
    wantChildren: {
      type: Boolean,
      default: null,
    },
    smoking: {
      type: String,
      enum: ['no', 'occasionally', 'regularly'],
      default: 'no',
    },
    drinking: {
      type: String,
      enum: ['no', 'occasionally', 'regularly'],
      default: 'no',
    },
    preferences: {
      ageMin: Number,
      ageMax: Number,
      heightMin: Number,
      heightMax: Number,
      religions: [String],
      castes: [String],
      educations: [String],
      incomes: [String],
      locations: [String],
    },
    verifications: {
      emailVerified: {
        type: Boolean,
        default: false,
      },
      phoneVerified: {
        type: Boolean,
        default: false,
      },
      photoVerified: {
        type: Boolean,
        default: false,
      },
      idVerified: {
        type: Boolean,
        default: false,
      },
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// Geospatial index for location-based search
profileSchema.index({ 'location.coordinates': '2dsphere' });
profileSchema.index({ gender: 1, 'dateOfBirth': 1 });
profileSchema.index({ userId: 1 });

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema);
