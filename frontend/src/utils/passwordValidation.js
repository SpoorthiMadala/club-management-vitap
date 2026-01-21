/**
 * Password validation utility
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
 */

export const validatePassword = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasDigit: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
    };

    const isValid = Object.values(requirements).every(req => req === true);

    return {
        isValid,
        requirements
    };
};

export const getPasswordStrength = (password) => {
    const validation = validatePassword(password);
    const metRequirements = Object.values(validation.requirements).filter(req => req === true).length;

    if (metRequirements === 0) return { strength: 'none', color: '#d1d5db', label: '' };
    if (metRequirements <= 2) return { strength: 'weak', color: '#ef4444', label: 'Weak' };
    if (metRequirements <= 4) return { strength: 'medium', color: '#f59e0b', label: 'Medium' };
    return { strength: 'strong', color: '#10b981', label: 'Strong' };
};
