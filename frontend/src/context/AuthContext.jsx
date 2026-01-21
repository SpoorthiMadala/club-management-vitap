import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [club, setClub] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load auth data from localStorage on mount
        const storedToken = localStorage.getItem('token');
        const storedClub = localStorage.getItem('club');

        if (storedToken && storedClub) {
            setToken(storedToken);
            setClub(JSON.parse(storedClub));
        }
        setLoading(false);
    }, []);

    const login = (token, clubData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('club', JSON.stringify(clubData));
        setToken(token);
        setClub(clubData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('club');
        setToken(null);
        setClub(null);
    };

    const updateClub = (clubData) => {
        localStorage.setItem('club', JSON.stringify(clubData));
        setClub(clubData);
    };

    const value = {
        club,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        updateClub,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
