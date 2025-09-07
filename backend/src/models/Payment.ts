import mongoose, { Document, Schema } from 'mongoose';

/**
 * Payment interface
 */
export interface IPayment extends Document {
  roomId: string;
  roomName: string;
  paymentType: 'buy' | 'rent';
  amount: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  transactionId: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment schema
 */
const PaymentSchema: Schema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['buy', 'rent'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
PaymentSchema.index({ customerEmail: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
