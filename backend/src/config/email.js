// backend/src/config/email.js
import nodemailer from 'nodemailer';
import logger from './logger.js';

// Create and configure email transporter
const createTransporter = () => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      logger.error('Email transporter verification failed:', error);
    } else {
      logger.info('Email server is ready to take our messages');
    }
  });

  return transporter;
};

// Email templates for different scenarios
export const emailTemplates = {
  welcome: {
    subject: 'Welcome to Safety Equipment Store - Kenya',
    getHtml: (userName) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c5530; font-size: 28px; margin: 0;">Welcome to Safety Equipment Store</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0;">Your trusted partner for safety equipment in Kenya</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c5530; font-size: 20px;">Hello ${userName}!</h2>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Thank you for joining Safety Equipment Store, Kenya's premier destination for professional safety equipment. 
              We're excited to help you find the best protection gear for your needs.
            </p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #2c5530; font-size: 18px; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #444; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Browse our extensive collection of safety equipment</li>
              <li>Enjoy competitive prices in KES with local delivery</li>
              <li>Get expert advice from our safety professionals</li>
              <li>Track your orders and manage your account easily</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
               style="background-color: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
              Start Shopping
            </a>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              Safety Equipment Store | Nairobi, Kenya<br>
              Email: ${process.env.EMAIL_FROM}<br>
              All prices in KES | Free delivery within Nairobi
            </p>
          </div>
        </div>
      </div>
    `
  },

  orderConfirmation: {
    subject: 'Order Confirmation - Safety Equipment Store',
    getHtml: (orderData) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c5530; font-size: 28px; margin: 0;">Order Confirmed!</h1>
            <p style="color: #27ae60; font-size: 18px; font-weight: bold; margin: 10px 0;">Order #${orderData.orderNumber}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c5530; font-size: 20px;">Hello ${orderData.customerName}!</h2>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Thank you for your order! We've received your order and are preparing it for shipment.
              You'll receive a tracking number once your order is dispatched.
            </p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #2c5530; font-size: 18px; margin-bottom: 15px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px 0; color: #666;">Order Total:</td>
                <td style="padding: 10px 0; color: #2c5530; font-weight: bold; text-align: right;">
                  KES ${orderData.totalAmount?.toLocaleString('en-KE') || '0'}
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px 0; color: #666;">Payment Method:</td>
                <td style="padding: 10px 0; color: #444; text-align: right;">${orderData.paymentMethod || 'Card'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;">Estimated Delivery:</td>
                <td style="padding: 10px 0; color: #444; text-align: right;">3-5 Business Days</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${orderData.orderId}" 
               style="background-color: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block; margin-right: 10px;">
              Track Order
            </a>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
               style="background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
              Continue Shopping
            </a>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              Safety Equipment Store | Nairobi, Kenya<br>
              Need help? Contact us at ${process.env.EMAIL_FROM}<br>
              All prices in KES
            </p>
          </div>
        </div>
      </div>
    `
  },

  passwordReset: {
    subject: 'Password Reset - Safety Equipment Store',
    getHtml: (resetUrl, userName) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c5530; font-size: 28px; margin: 0;">Password Reset Request</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c5530; font-size: 20px;">Hello ${userName}!</h2>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              You requested a password reset for your Safety Equipment Store account.
              Click the button below to reset your password. This link will expire in 10 minutes.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${resetUrl}" 
               style="background-color: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>

          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px;">
            <p style="color: #856404; font-size: 14px; margin: 0;">
              <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. 
              Your password will remain unchanged.
            </p>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              Safety Equipment Store | Nairobi, Kenya<br>
              Email: ${process.env.EMAIL_FROM}
            </p>
          </div>
        </div>
      </div>
    `
  }
};

// Export the createTransporter function as default
export default createTransporter;