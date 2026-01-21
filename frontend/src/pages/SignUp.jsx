import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { validatePassword } from '../utils/passwordValidation';
import api from '../utils/api';

const SignUp = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1); // 1: signup form, 2: OTP verification
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            setError('Password does not meet all requirements. Please check the password requirements below.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/signup', {
                name: formData.name,
                description: formData.description,
                email: formData.email,
                password: formData.password
            });

            setSuccess(response.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/verify-otp', {
                email: formData.email,
                otp
            });

            login(response.data.token, response.data.club);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post('/auth/resend-otp', {
                email: formData.email
            });
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
            <div className="flex-1 overflow-y-auto px-4 py-8">
                <div className="max-w-md w-full mx-auto space-y-8 animate-fade-in">
                    <div className="glass-card p-6 sm:p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-[#7d6b57] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#666b5e]">
                                {step === 1 ? 'Register Your Club' : 'Verify Your Email'}
                            </h2>
                            <p className="text-[#7d6b57] mt-2 text-sm sm:text-base">
                                {step === 1 ? 'Join the community and manage your club' : 'Enter the OTP sent to your email'}
                            </p>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                {success}
                            </div>
                        )}

                        {/* Step 1: Signup Form */}
                        {step === 1 && (
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#666b5e] mb-2">Club Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="Enter your club name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#666b5e] mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="input-field resize-none"
                                        placeholder="Describe your club"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#666b5e] mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="Enter email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#666b5e] mb-2">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="Min 8 chars, 1 upper, 1 lower, 1 digit, 1 special"
                                    />
                                    {formData.password && (
                                        <PasswordStrengthIndicator password={formData.password} />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#666b5e] mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="Re-enter your password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary"
                                >
                                    {loading ? 'Sending OTP...' : 'Sign Up'}
                                </button>
                            </form>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <div className="text-center mb-6">
                                    <p className="text-gray-700 text-[#666b5e]-200">
                                        We've sent a 6-digit OTP to <strong>{formData.email}</strong>
                                    </p>
                                    <p className="text-sm text-gray-600 text-[#666b5e]-300 mt-2">
                                        The OTP will expire in 10 minutes
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#666b5e] mb-2">Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength="6"
                                        className="input-field text-center text-2xl tracking-widest"
                                        placeholder="000000"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full btn-primary"
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={loading}
                                        className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to="/signin" className="text-primary-600 hover:text-primary-700 font-semibold">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

