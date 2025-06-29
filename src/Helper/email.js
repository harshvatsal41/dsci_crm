import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import User from '@/Mongo/Model/AccessModels/User';
import Vendor from '@/Mongo/Model/AccessModels/Vendor';

export const sendEmail = async ({ email, emailType, userId }) => {

    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000,
            });
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000,
            });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
            html: `<p>Click <a href="${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'}?token=${hashedToken}">here</a> to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'}</p>`
        };

        console.log("Mail sent successfully");

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error.message);
    }
};


export const sendVendorEmail = async ({ email, emailType, vendorId }) => {
    console.log("vendorId received:", vendorId);

    try {
        const hashedToken = await bcrypt.hash(vendorId.toString(), 10);

        if (emailType === 'VERIFY') {
            await Vendor.findByIdAndUpdate(vendorId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
            });
        } else if (emailType === 'RESET') {
            await Vendor.findByIdAndUpdate(vendorId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000,
            });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const emailTemplates = {
            VERIFY: {
                subject: process.env.MAIL_USER,
                html: `
                    <h2>Welcome to Our Platform!</h2>
                    <p>Thank you for registering as a vendor. Please verify your email by clicking the link below:</p>
                    <a href="${process.env.DOMAIN}/vendor/passverify?token=${hashedToken}" style="background: #4CAF50; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
                    <p>This link will expire in 1 hour.</p>
                `,
            },
            RESET: {
                subject: 'Reset Your Password',
                html: `
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your password. Click the link below to set a new password:</p>
                    <a href="${process.env.DOMAIN}/vendor/passreset?token=${hashedToken}" style="background: #FF5733; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>If you did not request this, please ignore this email.</p>
                `,
            },
        };

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: emailTemplates[emailType].subject,
            html: emailTemplates[emailType].html,
        };

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};


