import nodemailer from 'nodemailer';
import { apiResponse, STATUS_CODES } from '../response';

// Email configuration
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
const verifyConnection = async () => {
    try {
        await transporter.verify();
        console.log('SMTP connection verified successfully');
        return true;
    } catch (error) {
        console.error('SMTP connection verification failed:', error);
        return false;
    }
};

// Email Templates
const emailTemplates = {

    welcome: (name) => ({
        subject: 'Welcome to Our Platform',
        html: `
            <h1>Welcome ${name}!</h1>
            <p>Thank you for joining our platform.</p>
        `
    }),
    
    resetPassword: (resetLink) => ({
        subject: 'Password Reset Request',
        html: `
            <h1>Password Reset Request</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
        `
    }),
    vendorCreated: (vendorDetails) => ({
        subject: 'Welcome to RSV - Vendor Account Created',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2c3e50;">Welcome to RSV!</h1>
                <p>Dear ${vendorDetails.partyName},</p>
                <p>Your vendor account has been successfully created in our system.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h2 style="color: #34495e; margin-top: 0;">Account Details:</h2>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 10px 0;"><strong>Vendor ID:</strong> ${vendorDetails._id}</li>
                        <li style="margin: 10px 0;"><strong>Business Name:</strong> ${vendorDetails.partyName}</li>
                        <li style="margin: 10px 0;"><strong>Type:</strong> ${vendorDetails.vendorType}</li>
                        <li style="margin: 10px 0;"><strong>Email:</strong> ${vendorDetails.email}</li>
                        <li style="margin: 10px 0;"><strong>Location:</strong> ${vendorDetails.station}</li>
                    </ul>
                </div>

                <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
                    <h2 style="color: #2e7d32; margin-top: 0;">Verify Your Account</h2>
                    <p>Please click the button below to verify your account:</p>
                    <a href="${process.env.DOMAIN}/vendor/passverify?token=${vendorDetails.verifyToken}" 
                       style="display: inline-block; background: #2e7d32; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 5px; margin: 10px 0;">
                        Verify Account
                    </a>
                    <p style="color: #666; font-size: 0.9em;">This verification link will expire in 7 days.</p>
                </div>

                <p>After verification, you can access our platform to:</p>
                <ul>
                    <li>Manage your inventory</li>
                    <li>Process orders</li>
                    <li>Track deliveries</li>
                </ul>

                <p style="color: #7f8c8d; font-size: 0.9em; margin-top: 30px;">
                    If you have any questions or need assistance, please don't hesitate to contact our support team.
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #95a5a6; font-size: 0.8em;">
                        This is an automated message, please do not reply directly to this email.
                    </p>
                </div>
            </div>
        `
    })
};

// Generic send email function
const sendEmail = async ({ to, subject, html, attachments = [] }) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM_EMAIL,
            to,
            subject,
            html,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};


export const sendWelcomeEmail = async (to, name) => {
    const template = emailTemplates.welcome(name);
    return sendEmail({
        to,
        ...template
    });
};

export const sendPasswordResetEmail = async (to, resetLink) => {
    const template = emailTemplates.resetPassword(resetLink);
    return sendEmail({
        to,
        ...template
    });
};

export const sendVendorCreationEmail = async (to, vendorDetails) => {
    const template = emailTemplates.vendorCreated(vendorDetails);
    return sendEmail({
        to,
        ...template
    });
};

export const sendBulkEmails = async (recipients, templateName, templateData) => {
    try {
        if (!emailTemplates[templateName]) {
            throw new Error('Invalid template name');
        }

        const results = await Promise.all(
            recipients.map(async (recipient) => {
                try {
                    const template = emailTemplates[templateName](templateData);
                    await sendEmail({
                        to: recipient,
                        ...template
                    });
                    return { email: recipient, status: 'success' };
                } catch (error) {
                    return { email: recipient, status: 'failed', error: error.message };
                }
            })
        );

        return {
            success: true,
            results
        };
    } catch (error) {
        throw new Error('Bulk email sending failed');
    }
};

// Initialize email service
export const initializeEmailService = async () => {
    const isConnected = await verifyConnection();
    if (!isConnected) {
        console.error('Failed to initialize email service');
        return false;
    }
    return true;
};

export default {
    sendEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendVendorCreationEmail,
    sendBulkEmails,
    initializeEmailService
}; 