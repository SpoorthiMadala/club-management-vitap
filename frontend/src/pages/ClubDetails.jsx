import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const ClubDetails = () => {
    const { clubId } = useParams();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClubDetails();
    }, [clubId]);

    const fetchClubDetails = async () => {
        try {
            const response = await api.get(`/public/clubs/${clubId}`);
            setClub(response.data.club);
        } catch (err) {
            setError('Failed to load club details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
        );
    }

    if (error || !club) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 text-center">
                    <p className="text-red-600 text-xl">{error || 'Club not found'}</p>
                    <Link to="/" className="btn-primary mt-4 inline-block">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-6 font-semibold">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>

                    {/* Club Header */}
                    <div className="glass-card p-4 sm:p-6 md:p-8 mb-8 animate-fade-in">
                        <div className="flex items-center mb-6 flex-wrap gap-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                                {club.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 truncate">{club.name}</h1>
                                <p className="text-gray-600 mt-2 text-sm sm:text-base truncate">{club.email}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">About</h2>
                            <p className="text-gray-600 whitespace-pre-wrap">{club.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        {/* Members Section */}
                        <div className="animate-slide-up">
                            <div className="glass-card p-4 sm:p-6 mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Members ({club.members?.length || 0})
                                </h2>
                            </div>

                            {club.members && club.members.length > 0 ? (
                                <div className="space-y-4">
                                    {club.members.map((member) => (
                                        <div key={member._id} className="card p-6">
                                            <div className="flex items-center">
                                                <div className="w-14 h-14 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg">{member.name}</h3>
                                                    <p className="text-primary-600 font-semibold">{member.role}</p>
                                                    <p className="text-sm text-gray-600">{member.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="card p-8 text-center">
                                    <p className="text-gray-500">No members yet</p>
                                </div>
                            )}
                        </div>

                        {/* Events Section */}
                        <div className="animate-slide-up">
                            <div className="glass-card p-4 sm:p-6 mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Events ({club.events?.length || 0})
                                </h2>
                            </div>

                            {club.events && club.events.length > 0 ? (
                                <div className="space-y-4">
                                    {club.events.map((event) => (
                                        <Link
                                            key={event._id}
                                            to={`/events/${clubId}/${event._id}`}
                                            className="card p-6 block hover:scale-105"
                                        >
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(event.date)}
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {event.venue}
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center text-primary-600 font-semibold">
                                                View Details
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="card p-8 text-center">
                                    <p className="text-gray-500">No events yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubDetails;
