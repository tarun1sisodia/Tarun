const { createClient } = require('@supabase/supabase-js');
const User = require('../models/User');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        user_id: req.supabaseUser.id,
        name,
        email,
        subject,
        message,
        status: 'unread'
      });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Failed to submit contact form' });
    }

    // Return success response
    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      data
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
