import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Navbar = () => {
    const { isAuthenticated, club, logout } = useAuth();
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [showClubsDropdown, setShowClubsDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const response = await api.get('/public/clubs');
            setClubs(response.data.clubs);
        } catch (error) {
            console.error('Error fetching clubs:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass-card sticky top-0 z-50 shadow-lg rounded-none w-full">
            <div className="flex justify-between items-center h-16 md:h-18 lg:h-20 px-4 sm:px-6 md:px-8 lg:px-10">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 group flex-shrink-0">
                    <div className="bg-[#7d6b57] p-1.5 sm:p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-[#7d6b57] hidden sm:block">
                        Club Management
                    </span>
                    <span className="text-xs font-bold text-[#7d6b57] sm:hidden">
                        CM
                    </span>
                </Link>

                {/* Desktop Navigation - Shows on large screens (1024px+) */}
                <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
                    {/* Auth Buttons */}
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-2 xl:space-x-3">
                            <Link
                                to="/dashboard"
                                className="text-[#666b5e] hover:text-[#7d6b57] font-medium transition-colors duration-200 text-sm xl:text-base"
                            >
                                Dashboard
                            </Link>
                            <div className="flex items-center space-x-2 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-[#879e82]/20">
                                <div className="w-8 h-8 bg-[#7d6b57] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {club?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-[#666b5e] text-sm xl:text-base max-w-[120px] truncate">{club?.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 xl:px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 text-sm xl:text-base min-h-[44px]"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 xl:space-x-3">
                            <Link
                                to="/signin"
                                className="btn-primary px-4 xl:px-6"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="btn-primary px-4 xl:px-6"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Tablet/Mobile Menu Button - Shows below 1024px */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 rounded-lg hover:bg-white/40 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                >
                    <svg className="w-6 h-6 text-[#7d6b57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile/Tablet Menu - Shows below 1024px */}
            {mobileMenuOpen && (
                <div className="lg:hidden py-4 px-4 sm:px-6 md:px-8 lg:px-10 border-t border-[#879e82]/20">
                    <div className="space-y-2">

                        {isAuthenticated ? (
                            <>
                                <div className="px-4 py-2 mb-2">
                                    <div className="flex items-center space-x-3 text-[#666b5e]">
                                        <div className="w-10 h-10 bg-[#7d6b57] rounded-full flex items-center justify-center text-white font-bold">
                                            {club?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-base">{club?.name}</span>
                                    </div>
                                </div>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-[#666b5e] hover:bg-white/40 rounded-lg font-medium min-h-[48px] transition-colors text-base"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium min-h-[48px] transition-colors text-base"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/signin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 bg-[#7d6b57] text-white rounded-lg font-medium text-center min-h-[48px] hover:bg-[#666b5e] transition-colors text-base shadow-md"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 bg-[#7d6b57] text-white rounded-lg font-medium text-center min-h-[48px] hover:bg-[#666b5e] transition-colors text-base shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
