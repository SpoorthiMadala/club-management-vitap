import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const EventDetails = () => {
    const { clubId, eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEventDetails();
    }, [clubId, eventId]);

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/public/events/${clubId}/${eventId}`);
            setEvent(response.data.event);
        } catch (err) {
            setError('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
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
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-8 text-center">
                    <p className="text-red-600 text-xl">{error || 'Event not found'}</p>
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
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-6 font-semibold">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>

                    {/* Event Card */}
                    <div className="glass-card p-4 sm:p-6 md:p-8 animate-fade-in">
                        {/* Status Badge */}
                        <div className="flex items-center justify-between mb-6">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getEventStatus(event.date) === 'upcoming'
                                ? 'bg-green-100 text-green-700'
                                : getEventStatus(event.date) === 'ongoing'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                {getEventStatus(event.date) === 'upcoming' && 'Upcoming Event'}
                                {getEventStatus(event.date) === 'ongoing' && 'Ongoing Event'}
                                {getEventStatus(event.date) === 'completed' && 'Completed Event'}
                            </span>
                            <Link
                                to={`/clubs/${event.clubId}`}
                                className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
                            >
                                View Club
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        {/* Event Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{event.name}</h1>

                        {/* Club Name */}
                        <div className="flex items-center mb-6 text-primary-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="text-lg font-semibold">Organized by {event.clubName}</span>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-6 mb-8">
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Description</h2>
                                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{event.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Date */}
                                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg">
                                    <div className="flex items-start">
                                        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-3 rounded-lg mr-4">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-1">Date & Time</h3>
                                            <p className="text-gray-600">{formatDate(event.date)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Venue */}
                                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg">
                                    <div className="flex items-start">
                                        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-3 rounded-lg mr-4">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-1">Venue</h3>
                                            <p className="text-gray-600">{event.venue}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Registration Button */}
                        {getEventStatus(event.date) !== 'completed' ? (
                            <div className="bg-gradient-to-r from-primary-100 to-secondary-100 p-4 sm:p-6 md:p-8 rounded-lg text-center">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Ready to Join?</h3>
                                <p className="text-gray-600 mb-6">Click below to register for this event via Google Form</p>
                                <a
                                    href={event.googleFormLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary inline-flex items-center text-lg"
                                >
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Register Now
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        ) : (
                            <div className="bg-gray-100 p-8 rounded-lg text-center">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Event Completed</h3>
                                <p className="text-gray-600">This event has already taken place. Registration is closed.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
