const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const info = await transporter.sendMail({
      from: `"BloodConnect" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to BloodConnect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to BloodConnect, ${user.name}!</h2>
          <p>Thank you for joining our community of blood donors and recipients.</p>
          <p>Your account has been created successfully. You can now log in and start using our platform.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The BloodConnect Team</p>
        </div>
      `
    });
    
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send request confirmation email
const sendRequestConfirmationEmail = async (user, request) => {
  try {
    const info = await transporter.sendMail({
      from: `"BloodConnect" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Blood Request Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Blood Request Confirmation</h2>
          <p>Dear ${user.name},</p>
          <p>Your blood request for ${request.patientName} has been successfully created.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>Blood Type: ${request.bloodType}</li>
            <li>Units Needed: ${request.unitsNeeded}</li>
            <li>Hospital: ${request.hospital.name}</li>
            <li>Urgency: ${request.urgency}</li>
          </ul>
          <p>We will notify you when we find matching donors.</p>
          <p>Best regards,<br>The BloodConnect Team</p>
        </div>
      `
    });
    
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send donor match notification
const sendDonorMatchEmail = async (donor, request) => {
  try {
    const info = await transporter.sendMail({
      from: `"BloodConnect" <${process.env.EMAIL_USER}>`,
      to: donor.email,
      subject: 'Blood Donation Match Found',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Blood Donation Match</h2>
          <p>Dear ${donor.name},</p>
          <p>We have found a match for your blood type (${donor.bloodType})!</p>
          <p><strong>Request Details:</strong></p>
          <ul>
            <li>Patient: ${request.patientName}</li>
            <li>Blood Type Needed: ${request.bloodType}</li>
            <li>Hospital: ${request.hospital.name}, ${request.hospital.city}</li>
            <li>Urgency: ${request.urgency}</li>
          </ul>
          <p>If you are available to donate, please log in to your account and confirm your availability.</p>
          <p>Thank you for your generosity!</p>
          <p>Best regards,<br>The BloodConnect Team</p>
        </div>
      `
    });
    
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send requester notification when donor volunteers
const sendRequesterNotificationEmail = async (requester, donor, request) => {
  try {
    const info = await transporter.sendMail({
      from: `"BloodConnect" <${process.env.EMAIL_USER}>`,
      to: requester.email,
      subject: 'Donor Found for Your Blood Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Donor Found!</h2>
          <p>Dear ${requester.name},</p>
          <p>Good news! A donor has volunteered for your blood request.</p>
          <p><strong>Donor Details:</strong></p>
          <ul>
            <li>Name: ${donor.name}</li>
            <li>Blood Type: ${donor.bloodType}</li>
          </ul>
          <p><strong>Request Details:</strong></p>
          <ul>
            <li>Patient: ${request.patientName}</li>
            <li>Hospital: ${request.hospital.name}</li>
          </ul>
          <p>You can contact the donor through our platform.</p>
          <p>Best regards,<br>The BloodConnect Team</p>
        </div>
      `
    });
    
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendRequestConfirmationEmail,
  sendDonorMatchEmail,
  sendRequesterNotificationEmail
};
