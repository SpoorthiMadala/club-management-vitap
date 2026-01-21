import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Club from '../models/Club.js';
import OTP from '../models/OTP.js';
import { generateOTP, sendOTPEmail } from '../utils/emailService.js';

const router = express.Router();

// Password validation helper
const passwordValidator = (value) => {
    const minLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(value);

    if (!minLength) throw new Error('Password must be at least 8 characters long');
    if (!hasUppercase) throw new Error('Password must contain at least one uppercase letter');
    if (!hasLowercase) throw new Error('Password must contain at least one lowercase letter');
    if (!hasDigit) throw new Error('Password must contain at least one number');
    if (!hasSpecialChar) throw new Error('Password must contain at least one special character');

    return true;
};

// Sign Up - Send OTP
router.post('/signup', [
    body('name').trim().notEmpty().withMessage('Club name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .custom(passwordValidator)
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, description, email, password } = req.body;

        // Check if club already exists
        const existingClub = await Club.findOne({ $or: [{ email }, { name }] });
        if (existingClub) {
            if (existingClub.verified) {
                return res.status(400).json({
                    success: false,
                    message: 'Club with this email or name already exists'
                });
            } else {
                // Delete unverified club to allow re-registration
                await Club.findByIdAndDelete(existingClub._id);
            }
        }

        // Create new club (unverified)
        const club = new Club({
            name,
            description,
            email,
            password,
            verified: false
        });

        await club.save();

        // Generate and save OTP
        const otp = generateOTP();
        await OTP.create({ email, otp });

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.status(201).json({
            success: true,
            message: 'OTP sent to your email. Please verify within 10 minutes.',
            email
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during signup',
            error: error.message
        });
    }
});

// Verify OTP
router.post('/verify-otp', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, otp } = req.body;

        // Find OTP
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Find and verify club
        const club = await Club.findOne({ email });
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        club.verified = true;
        await club.save();

        // Delete OTP after verification
        await OTP.deleteOne({ email, otp });

        // Generate JWT token
        const token = jwt.sign({ clubId: club._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.json({
            success: true,
            message: 'Email verified successfully',
            token,
            club: {
                id: club._id,
                name: club.name,
                email: club.email,
                description: club.description
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying OTP',
            error: error.message
        });
    }
});

// Resend OTP
router.post('/resend-otp', [
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email } = req.body;

        // Check if club exists and is unverified
        const club = await Club.findOne({ email, verified: false });
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'No unverified club found with this email'
            });
        }

        // Delete old OTP
        await OTP.deleteMany({ email });

        // Generate and save new OTP
        const otp = generateOTP();
        await OTP.create({ email, otp });

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.json({
            success: true,
            message: 'New OTP sent to your email'
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resending OTP',
            error: error.message
        });
    }
});

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find club
        const club = await Club.findOne({ email });
        if (!club) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if verified
        if (!club.verified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first'
            });
        }

        // Check password
        const isMatch = await club.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign({ clubId: club._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            club: {
                id: club._id,
                name: club.name,
                email: club.email,
                description: club.description
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
});

// Forgot Password - Send OTP
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email } = req.body;

        // Find club
        const club = await Club.findOne({ email, verified: true });
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'No verified club found with this email'
            });
        }

        // Delete old OTPs for this email
        await OTP.deleteMany({ email });

        // Generate and save new OTP
        const otp = generateOTP();
        await OTP.create({ email, otp });

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.json({
            success: true,
            message: 'Password reset OTP sent to your email'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending reset OTP',
            error: error.message
        });
    }
});

// Reset Password - Verify OTP and Update Password
router.post('/reset-password', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .custom(passwordValidator)
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, otp, newPassword } = req.body;

        // Find OTP
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Find club
        const club = await Club.findOne({ email, verified: true });
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        // Update password (will be hashed by pre-save hook)
        club.password = newPassword;
        await club.save();

        // Delete OTP after successful reset
        await OTP.deleteOne({ email, otp });

        res.json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
});

export default router;
