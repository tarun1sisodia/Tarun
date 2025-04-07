const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  unitsNeeded: {
    type: Number,
    required: true,
    min: 1
  },
  hospital: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'fulfilled', 'closed'],
    default: 'open'
  },
  description: String,
  matchedDonors: [{
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['matched', 'contacted', 'confirmed', 'donated'],
      default: 'matched'
    },
    matchedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Method to get compatible blood types
requestSchema.methods.getCompatibleBloodTypes = function() {
  const compatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  };
  
  return compatibility[this.bloodType] || [];
};

// Method to add a matched donor
requestSchema.methods.addMatchedDonor = function(donorId) {
  if (!this.matchedDonors.some(match => match.donor.toString() === donorId.toString())) {
    this.matchedDonors.push({ donor: donorId });
    
    // Update status if this was the first match
    if (this.status === 'open' && this.matchedDonors.length > 0) {
      this.status = 'in-progress';
    }
    
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('Request', requestSchema);
