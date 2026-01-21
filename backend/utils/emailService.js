import dotenv from 'dotenv';

dotenv.config();

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email using Brevo API
export const sendOTPEmail = async (email, otp) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || 'Club Management System';

    if (!apiKey) {
      throw new Error('BREVO_API_KEY is not configured in .env file');
    }

    if (!senderEmail) {
      throw new Error('BREVO_SENDER_EMAIL is not configured in .env file');
    }

    const emailData = {
      sender: {
        name: senderName,
        email: senderEmail
      },
      to: [
        {
          email: email,
          name: email.split('@')[0]
        }
      ],
      subject: 'Email Verification - Club Management',
      htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #7d6b57 0%, #879e82 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .otp-box { background: white; border: 2px dashed #7d6b57; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
    .otp-code { font-size: 32px; font-weight: bold; color: #7d6b57; letter-spacing: 5px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Club Management System</h1>
    </div>
    <div class="content">
      <h2>Email Verification</h2>
      <p>Please use the following OTP to verify your email address:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      <p><strong>This OTP will expire in 10 minutes.</strong></p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>© 2025 Club Management System</p>
    </div>
  </div>
</body>
</html>
      `
    };

    console.log('Sending email via Brevo API to:', email);

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error response:', errorData);
      throw new Error(`Brevo API error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ OTP email sent successfully via Brevo API:', result.messageId);

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.error('Full error:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
};
