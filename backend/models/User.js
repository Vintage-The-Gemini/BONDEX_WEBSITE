// backend/models/User.js
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  // User role and status
  role: {
    type: String,
    enum: ['customer', 'admin', 'moderator'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  // Contact information
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[0-9]{10,15}$/, 'Please enter a valid phone number']
  },
  
  // Address information for Kenya
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    county: {
      type: String,
      trim: true
    },
    postalCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      default: 'Kenya',
      trim: true
    }
  },
  
  // User preferences
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    currency: {
      type: String,
      default: 'KES'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  
  // Account verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  // Password reset
  passwordResetToken: String,
  passwordResetExpire: Date,
  
  // Security
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Customer analytics
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  averageOrderValue: {
    type: Number,
    default: 0
  },
  
  // Account creation source
  registrationSource: {
    type: String,
    enum: ['website', 'mobile', 'admin', 'import'],
    default: 'website'
  },
  
  // Social login (optional for future)
  googleId: String,
  facebookId: String,
  
  // Profile image
  avatar: {
    url: String,
    public_id: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for account locked status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Hash password with bcrypt
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  
  try {
    return await bcryptjs.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        lockUntil: 1,
      },
      $set: {
        loginAttempts: 1,
      }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
    };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    }
  });
};

// Method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return this.save();
};

// Method to calculate user stats
userSchema.methods.calculateStats = function(orders) {
  if (!orders || orders.length === 0) {
    this.totalOrders = 0;
    this.totalSpent = 0;
    this.averageOrderValue = 0;
    return;
  }
  
  this.totalOrders = orders.length;
  this.totalSpent = orders.reduce((total, order) => total + order.totalAmount, 0);
  this.averageOrderValue = this.totalSpent / this.totalOrders;
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to get user statistics
userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        adminUsers: {
          $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
        },
        verifiedUsers: {
          $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    verifiedUsers: 0
  };
};

// Method to get safe user data (no sensitive info)
userSchema.methods.getSafeUserData = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpire;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpire;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  
  return userObject;
};

export default mongoose.model('User', userSchema);