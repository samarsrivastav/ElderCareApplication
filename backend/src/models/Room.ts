import mongoose, { Document, Schema } from 'mongoose';

/**
 * Room interface extending Mongoose Document
 */
export interface IRoom extends Document {
  name: string;
  facilityName: string;
  location: {
    city: string;
    area: string;
    address: string;
  };
  pricing: {
    rent: number;
    securityDeposit: number;
    admissionCharge?: number;
    pettyCashReserve?: number;
    currency: string;
  };
  roomType: 'assisted_living' | 'independent_living' | 'memory_care' | 'daycare';
  occupancy: 'single' | 'double' | 'shared';
  lengthOfStay: 'short' | 'medium' | 'long';
  careLevel: 'high' | 'medium' | 'low';
  description: string;
  medicalServices: string[];
  lifestyle: {
    rating: number;
    amenities: string[];
  };
  medical: {
    rating: number;
    services: string[];
  };
  services: {
    rating: number;
    offerings: string[];
  };
  community: {
    rating: number;
    activities: string[];
  };
  facilities: {
    sharedSpaces: string[];
    safetyFeatures: string[];
    accessibility: string[];
  };
  images: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  overallRating: number;
  totalCost: number;
}

/**
 * Room schema definition
 */
const roomSchema = new Schema<IRoom>({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true
  },
  facilityName: {
    type: String,
    required: [true, 'Facility name is required'],
    trim: true
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    }
  },
  pricing: {
    rent: {
      type: Number,
      required: [true, 'Rent amount is required'],
      min: [0, 'Rent cannot be negative']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit cannot be negative']
    },
    admissionCharge: {
      type: Number,
      min: [0, 'Admission charge cannot be negative']
    },
    pettyCashReserve: {
      type: Number,
      min: [0, 'Petty cash reserve cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR']
    }
  },
  roomType: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['assisted_living', 'independent_living', 'memory_care', 'daycare']
  },
  occupancy: {
    type: String,
    required: [true, 'Occupancy type is required'],
    enum: ['single', 'double', 'shared']
  },
  lengthOfStay: {
    type: String,
    required: [true, 'Length of stay is required'],
    enum: ['short', 'medium', 'long']
  },
  careLevel: {
    type: String,
    required: [true, 'Care level is required'],
    enum: ['high', 'medium', 'low']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  medicalServices: [{
    type: String,
    trim: true
  }],
  lifestyle: {
    rating: {
      type: Number,
      required: [true, 'Lifestyle rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10']
    },
    amenities: [{
      type: String,
      trim: true
    }]
  },
  medical: {
    rating: {
      type: Number,
      required: [true, 'Medical rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10']
    },
    services: [{
      type: String,
      trim: true
    }]
  },
  services: {
    rating: {
      type: Number,
      required: [true, 'Services rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10']
    },
    offerings: [{
      type: String,
      trim: true
    }]
  },
  community: {
    rating: {
      type: Number,
      required: [true, 'Community rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10']
    },
    activities: [{
      type: String,
      trim: true
    }]
  },
  facilities: {
    sharedSpaces: [{
      type: String,
      trim: true
    }],
    safetyFeatures: [{
      type: String,
      trim: true
    }],
    accessibility: [{
      type: String,
      trim: true
    }]
  },
  images: [{
    type: String,
    trim: true
  }],
  contactInfo: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for overall rating
roomSchema.virtual('overallRating').get(function() {
  const total = this.lifestyle.rating + this.medical.rating + this.services.rating + this.community.rating;
  return Math.round((total / 4) * 10) / 10;
});

// Virtual for total cost
roomSchema.virtual('totalCost').get(function() {
  let total = this.pricing.rent;
  if (this.pricing.admissionCharge) total += this.pricing.admissionCharge;
  if (this.pricing.pettyCashReserve) total += this.pricing.pettyCashReserve;
  return total;
});

// Indexes for better query performance
roomSchema.index({ 'location.city': 1 });
roomSchema.index({ 'location.area': 1 });
roomSchema.index({ roomType: 1 });
roomSchema.index({ 'pricing.rent': 1 });
roomSchema.index({ 'lifestyle.rating': 1 });
roomSchema.index({ 'medical.rating': 1 });
roomSchema.index({ 'services.rating': 1 });
roomSchema.index({ 'community.rating': 1 });
roomSchema.index({ isActive: 1 });

export const Room = mongoose.model<IRoom>('Room', roomSchema);
