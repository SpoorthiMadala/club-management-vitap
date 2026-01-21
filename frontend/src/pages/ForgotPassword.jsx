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
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                                    <div className="relative">
                                        <input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="input-field pr-12"
                                            placeholder="Min 8 chars, 1 upper, 1 lower, 1 digit, 1 special"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                                        >
                                            {showNewPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>

                                            )}
                                        </button>
                                    </div>
                                    {newPassword && (
                                        <PasswordStrengthIndicator password={newPassword} />
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#666b5e] mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="input-field pr-12"
                                            placeholder="Re-enter password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (

                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
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
