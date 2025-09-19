import mongoose, { Document, Schema } from 'mongoose';

/**
 * Blog interface
 */
export interface IBlog extends Document {
  title: string;
  image: string; // Cloudinary URL
  description: string;
  content: string; // Full blog content
  authorName: string;
  authorId: mongoose.Types.ObjectId;
  published: boolean;
  tags: string[];
  slug: string; // URL-friendly version of title
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Blog schema
 */
const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
    validate: {
      validator: function(v: string) {
        return /^(https:\/\/|data:image\/)/.test(v);
      },
      message: 'Image must be a valid HTTPS URL or base64 data URL'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
  next();
});

// Index for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ authorId: 1 });

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
