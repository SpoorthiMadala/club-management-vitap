import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const LandingPage = () => {
    const [clubs, setClubs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('clubs');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [clubsRes, eventsRes] = await Promise.all([
                api.get('/public/clubs'),
                api.get('/public/events')
            ]);
            setClubs(clubsRes.data.clubs);
            setEvents(eventsRes.data.events);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getEventStatus = (dateString) => {
        const eventDate = new Date(dateString);
        const today = new Date();

        // Set both dates to start of day for accurate comparison
        eventDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (eventDate < today) {
            return 'completed';
        } else if (eventDate.getTime() === today.getTime()) {
            return 'ongoing';
        } else {
            return 'upcoming';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
                    <p className="text-white text-xl font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-y-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12 animate-fade-in">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#666b5e] mb-4 px-4">
                            Welcome to Club Management
                        </h1>
                        <p className="text-lg sm:text-xl text-[#7d6b57] max-w-2xl mx-auto px-4">
                            Discover amazing clubs, join exciting events, and be part of a vibrant community
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center mb-8 gap-3 sm:gap-4 px-4">
                        <button
                            onClick={() => setActiveTab('clubs')}
                            className={`px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 min-h-[44px] text-sm sm:text-base ${activeTab === 'clubs'
                                ? 'bg-white text-[#7d6b57] shadow-lg scale-105'
                                : 'bg-white/40 text-[#666b5e] hover:bg-white/50'
                                }`}
                        >
                            All Clubs ({clubs.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 min-h-[44px] text-sm sm:text-base ${activeTab === 'events'
                                ? 'bg-white text-[#7d6b57] shadow-lg scale-105'
                                : 'bg-white/40 text-[#666b5e] hover:bg-white/50'
                                }`}
                        >
                            Upcoming & Ongoing Events ({events.length})
                        </button>
                    </div>

                    {/* Clubs Section */}
                    {activeTab === 'clubs' && (
                        <div className="animate-slide-up">
                            {clubs.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {clubs.map((club) => (
                                        <Link
                                            key={club._id}
                                            to={`/clubs/${club._id}`}
                                            className="card p-6 hover:scale-105"
                                        >
                                            <div className="flex items-center mb-4">
                                                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                                                    {club.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-[#666b5e]">{club.name}</h3>
                                                    <p className="text-sm text-[#7d6b57]">
                                                        {club.members?.length || 0} members · {club.events?.length || 0} events
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-[#666b5e] line-clamp-3">{club.description}</p>
                                            <div className="mt-4 flex items-center text-[#7d6b57] font-semibold">
                                                View Details
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-12 text-center">
                                    <svg className="w-24 h-24 mx-auto mb-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <h3 className="text-2xl font-bold text-[#666b5e] mb-2">No Clubs Yet</h3>
                                    <p className="text-[#7d6b57]">Be the first to register your club!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Events Section */}
                    {activeTab === 'events' && (
                        <div className="animate-slide-up">
                            {events.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {events.map((event) => (
                                        <Link
                                            key={event._id}
                                            to={`/events/${event.clubId}/${event._id}`}
                                            className="card p-6 hover:scale-105"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventStatus(event.date) === 'upcoming'
                                                    ? 'bg-green-100 text-green-700'
                                                    : getEventStatus(event.date) === 'ongoing'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {getEventStatus(event.date) === 'upcoming' && 'Upcoming'}
                                                    {getEventStatus(event.date) === 'ongoing' && 'Ongoing'}
                                                    {getEventStatus(event.date) === 'completed' && 'Completed'}
                                                </span>
                                                <span className="text-sm text-[#7d6b57]">{formatDate(event.date)}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-[#666b5e] mb-2">{event.name}</h3>
                                            <p className="text-sm text-primary-600 font-semibold mb-2">
                                                by {event.clubName}
                                            </p>
                                            <p className="text-[#666b5e] mb-4 line-clamp-2">{event.description}</p>
                                            <div className="flex items-center text-[#7d6b57] text-sm mb-4">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {event.venue}
                                            </div>
                                            <div className="mt-4 flex items-center text-[#7d6b57] font-semibold">
                                                View Details & Register
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-12 text-center">
                                    <svg className="w-24 h-24 mx-auto mb-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-2xl font-bold text-[#666b5e] mb-2">No Events Yet</h3>
                                    <p className="text-[#7d6b57]">Check back soon for upcoming events!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
};

export default LandingPage;
