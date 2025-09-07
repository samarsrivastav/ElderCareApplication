import mongoose, { Document, Schema } from 'mongoose';

/**
 * Contact interface
 */
export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contact schema
 */
const ContactSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
ContactSchema.index({ email: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1 });

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
