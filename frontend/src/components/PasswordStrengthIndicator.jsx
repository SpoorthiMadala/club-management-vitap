import React from 'react';
import { validatePassword, getPasswordStrength } from '../utils/passwordValidation';

const PasswordStrengthIndicator = ({ password, showStrengthBar = true }) => {
    const validation = validatePassword(password);
    const strength = getPasswordStrength(password);

    const requirements = [
        { key: 'minLength', label: 'At least 8 characters', met: validation.requirements.minLength },
        { key: 'hasUppercase', label: 'One uppercase letter (A-Z)', met: validation.requirements.hasUppercase },
        { key: 'hasLowercase', label: 'One lowercase letter (a-z)', met: validation.requirements.hasLowercase },
        { key: 'hasDigit', label: 'One number (0-9)', met: validation.requirements.hasDigit },
        { key: 'hasSpecialChar', label: 'One special character (!@#$%...)', met: validation.requirements.hasSpecialChar }
    ];

    return (
        <div className="mt-3 space-y-3">
            {/* Strength Bar */}
            {showStrengthBar && password.length > 0 && (
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#666b5e]">Password Strength</span>
                        <span className="text-xs font-semibold" style={{ color: strength.color }}>
                            {strength.label}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-300 rounded-full"
                            style={{
                                width: `${(Object.values(validation.requirements).filter(r => r).length / 5) * 100}%`,
                                backgroundColor: strength.color
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Requirements Checklist */}
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-[#879e82]/20">
                <p className="text-xs font-semibold text-[#666b5e] mb-2">Password must contain:</p>
                <ul className="space-y-1.5">
                    {requirements.map((req) => (
                        <li key={req.key} className="flex items-start gap-2 text-xs sm:text-sm">
                            <span className="flex-shrink-0 mt-0.5">
                                {req.met ? (
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </span>
                            <span className={`${req.met ? 'text-green-700' : 'text-[#666b5e]'} transition-colors duration-200`}>
                                {req.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;
