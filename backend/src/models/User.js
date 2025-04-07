const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  supabaseId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  donationCount: {
    type: Number,
    default: 0
  },
  lastDonation: {
    type: Date
  },
  isEligible: {
    type: Boolean,
    default: true
  },
  profilePicture: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Method to check if user is eligible to donate
userSchema.methods.checkEligibility = function() {
  if (!this.lastDonation) return true;
  
  // Check if 3 months have passed since last donation
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  return this.lastDonation < threeMonthsAgo;
};

// Method to update donation count
userSchema.methods.updateDonationCount = function() {
  this.donationCount += 1;
  this.lastDonation = new Date();
  this.isEligible = false;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
