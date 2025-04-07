const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  },
  hospital: {
    name: String,
    address: String,
    city: String,
    state: String
  },
  donationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  units: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationDocument: String,
  notes: String
}, { timestamps: true });

// Post-save hook to update user donation count and request status
donationSchema.post('save', async function(doc) {
  try {
    // Update donor's donation count
    const User = mongoose.model('User');
    const donor = await User.findById(doc.donor);
    if (donor) {
      await donor.updateDonationCount();
    }
    
    // Update request status if applicable
    if (doc.request) {
      const Request = mongoose.model('Request');
      const request = await Request.findById(doc.request);
      
      if (request) {
        // Count verified donations for this request
        const Donation = mongoose.model('Donation');
        const donationCount = await Donation.countDocuments({
          request: request._id,
          verified: true
        });
        
        // If enough donations, mark request as fulfilled
        if (donationCount >= request.unitsNeeded) {
          request.status = 'fulfilled';
          await request.save();
        }
      }
    }
  } catch (error) {
    console.error('Error in donation post-save hook:', error);
  }
});

module.exports = mongoose.model('Donation', donationSchema);
