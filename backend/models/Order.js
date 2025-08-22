import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'cash_on_delivery'],
    default: 'credit_card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ''
    }
  }]
}, {
  timestamps: true
});

// Calculate total before saving
orderSchema.pre('save', function(next) {
  if (this.items.length === 0) {
    this.total = 0;
    return next();
  }

  this.total = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  next();
});

// Initialize status history for new orders
orderSchema.pre('save', function(next) {
  if (this.isNew && this.status && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      changedBy: 'System',
      notes: 'Order created'
    });
  }
  next();
});

// Method to update order status with history tracking
orderSchema.methods.updateStatus = async function(newStatus, changedBy, notes = '') {
  // Add current status to history before updating
  if (this.status) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      changedBy: changedBy,
      notes: notes
    });
  }
  
  this.status = newStatus;
  return await this.save();
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = async function(newPaymentStatus) {
  this.paymentStatus = newPaymentStatus;
  return await this.save();
};

// Method to get status history
orderSchema.methods.getStatusHistory = function() {
  return this.statusHistory.sort((a, b) => b.changedAt - a.changedAt);
};

// Method to get current status info
orderSchema.methods.getCurrentStatus = function() {
  return {
    status: this.status,
    lastUpdated: this.statusHistory.length > 0 ? 
      this.statusHistory[this.statusHistory.length - 1].changedAt : 
      this.createdAt,
    updatedBy: this.statusHistory.length > 0 ? 
      this.statusHistory[this.statusHistory.length - 1].changedBy : 
      'System'
  };
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
