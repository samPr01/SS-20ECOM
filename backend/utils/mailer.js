import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false // Only for development/testing
    }
  });
};

// Verify SMTP connection
export const verifySMTPConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    return false;
  }
};

// Send email function
export const sendEmail = async (to, subject, html, text = null) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send test email
export const sendTestEmail = async (to = 'test@example.com') => {
  const subject = 'Test Email from SS-20ECOM';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Test Email from SS-20ECOM</h2>
      <p>This is a test email to verify SMTP configuration.</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST || 'smtp.gmail.com'}</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        If you received this email, your SMTP configuration is working correctly!
      </p>
    </div>
  `;
  
  return await sendEmail(to, subject, html);
};

// Email templates
export const emailTemplates = {
  // Order confirmation email
  orderConfirmation: (orderDetails, userEmail) => {
    const subject = `Order Confirmation #${orderDetails._id.slice(-8)} - SS-20ECOM`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your order has been successfully placed</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${orderDetails._id}</p>
            <p><strong>Order Date:</strong> ${new Date(orderDetails.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${orderDetails.total.toFixed(2)}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">${orderDetails.status}</span></p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Order Items</h3>
            ${orderDetails.items.map(item => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p style="margin: 5px 0;"><strong>${item.name}</strong></p>
                <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity} × ₹${item.price.toFixed(2)}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
            <p style="margin: 5px 0;">${orderDetails.shippingAddress.street}</p>
            <p style="margin: 5px 0;">${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.zipCode}</p>
            <p style="margin: 5px 0;">${orderDetails.shippingAddress.country}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">We'll notify you when your order ships!</p>
            <p style="color: #666;">If you have any questions, please contact our support team.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This email was sent to ${userEmail}</p>
          <p>&copy; 2024 SS-20ECOM. All rights reserved.</p>
        </div>
      </div>
    `;
    
    return { subject, html };
  },

  // Order status update email
  orderStatusUpdate: (orderDetails, newStatus, userEmail) => {
    const statusColors = {
      'confirmed': '#28a745',
      'processing': '#ffc107',
      'shipped': '#17a2b8',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    };
    
    const subject = `Order Status Update #${orderDetails._id.slice(-8)} - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Order Status Update</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your order status has been updated</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <h3 style="color: #333; margin-top: 0;">New Status</h3>
            <div style="background: ${statusColors[newStatus] || '#6c757d'}; color: white; padding: 15px; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 18px;">
              ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Order Information</h3>
            <p><strong>Order ID:</strong> ${orderDetails._id}</p>
            <p><strong>Total Amount:</strong> ₹${orderDetails.total.toFixed(2)}</p>
            <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Thank you for choosing SS-20ECOM!</p>
            <p style="color: #666;">If you have any questions, please contact our support team.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This email was sent to ${userEmail}</p>
          <p>&copy; 2024 SS-20ECOM. All rights reserved.</p>
        </div>
      </div>
    `;
    
    return { subject, html };
  },

  // Password reset email
  passwordReset: (resetToken, userEmail) => {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request - SS-20ECOM';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">You requested to reset your password</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #333; margin-bottom: 20px;">Hello,</p>
            <p style="color: #333; margin-bottom: 20px;">We received a request to reset your password for your SS-20ECOM account.</p>
            <p style="color: #333; margin-bottom: 20px;">Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #667eea; font-size: 12px; word-break: break-all;">
              ${resetUrl}
            </p>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #856404; margin-top: 0;">Important:</h4>
            <ul style="color: #856404; margin: 10px 0; padding-left: 20px;">
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Your password will remain unchanged until you click the link above</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">If you have any questions, please contact our support team.</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This email was sent to ${userEmail}</p>
          <p>&copy; 2024 SS-20ECOM. All rights reserved.</p>
        </div>
      </div>
    `;
    
    return { subject, html };
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const { subject, html } = emailTemplates.orderConfirmation(orderDetails, userEmail);
  return await sendEmail(userEmail, subject, html);
};

// Send order status update email
export const sendOrderStatusUpdateEmail = async (userEmail, orderDetails, newStatus) => {
  const { subject, html } = emailTemplates.orderStatusUpdate(orderDetails, newStatus, userEmail);
  return await sendEmail(userEmail, subject, html);
};

// Send password reset email
export const sendPasswordResetEmail = async (userEmail, resetToken) => {
  const { subject, html } = emailTemplates.passwordReset(resetToken, userEmail);
  return await sendEmail(userEmail, subject, html);
};

export default {
  sendEmail,
  sendTestEmail,
  verifySMTPConnection,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendPasswordResetEmail,
  emailTemplates
};
