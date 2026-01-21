import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { validatePassword } from '../utils/passwordValidation';
import api from '../utils/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post('/auth/forgot-password', { email });
            setSuccess(response.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            setError('Password does not meet all requirements. Please check the password requirements below.');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setSuccess(response.data.message);
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post('/auth/forgot-password', { email });
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-y-auto flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 animate-fade-in">
                    <div className="glass-card p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-black dark:text-white">Forgot Password</h2>
                            <p className="mt-2 text-gray-700 dark:text-gray-200">
                                {step === 1 ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                                {success}
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-black dark:text-white mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="input-field"
                                        placeholder="club@example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full"
                                >
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>

                                <div className="text-center">
                                    <Link to="/signin" className="text-primary-600 hover:text-primary-700 font-semibold">
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-semibold text-[#666b5e] mb-2">
                                        OTP Code
                                    </label>
                                    <input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength="6"
                                        className="input-field"
                                        placeholder="Enter 6-digit OTP"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-semibold text-[#666b5e] mb-2">
                                        New Password
                                    </label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="input-field"
                                        placeholder="Min 8 chars, 1 upper, 1 lower, 1 digit, 1 special"
                                    />
                                    {newPassword && (
                                        <PasswordStrengthIndicator password={newPassword} />
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#666b5e] mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="input-field"
                                        placeholder="Re-enter password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full"
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>

                                <div className="text-center space-y-2">
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={loading}
                                        className="text-primary-600 hover:text-primary-700 font-semibold"
                                    >
                                        Resend OTP
                                    </button>
                                    <div>
                                        <Link to="/signin" className="text-gray-600 hover:text-gray-800">
                                            Back to Sign In
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
