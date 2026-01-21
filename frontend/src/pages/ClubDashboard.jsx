import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ConfirmationModal from '../components/ConfirmationModal';
import api from '../utils/api';

const ClubDashboard = () => {
    const { club: authClub, updateClub } = useAuth();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    // Profile state
    const [description, setDescription] = useState('');
    const [editingProfile, setEditingProfile] = useState(false);

    // Member state
    const [showAddMember, setShowAddMember] = useState(false);
    const [memberForm, setMemberForm] = useState({ name: '', role: '', email: '' });

    // Event state
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [eventForm, setEventForm] = useState({
        name: '',
        description: '',
        date: '',
        venue: '',
        googleFormLink: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });

    useEffect(() => {
        fetchClubProfile();
    }, []);

    const fetchClubProfile = async () => {
        try {
            const response = await api.get('/club/profile');
            setClub(response.data.club);
            setDescription(response.data.club.description);
        } catch (err) {
            setError('Failed to fetch club profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await api.put('/club/profile', { description });
            setClub(response.data.club);
            updateClub(response.data.club);
            setSuccess('Profile updated successfully');
            setEditingProfile(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/club/members', memberForm);
            setClub({ ...club, members: [...club.members, response.data.member] });
            setSuccess('Member added successfully');
            setMemberForm({ name: '', role: '', email: '' });
            setShowAddMember(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add member');
        }
    };

    const handleDeleteMember = (memberId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Member',
            message: 'Are you sure you want to delete this member? This action cannot be undone.',
            onConfirm: async () => {
                setError('');
                setSuccess('');

                try {
                    await api.delete(`/club/members/${memberId}`);
                    setClub({ ...club, members: club.members.filter(m => m._id !== memberId) });
                    setSuccess('Member deleted successfully');
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to delete member');
                }
            }
        });
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/club/events', eventForm);
            setClub({ ...club, events: [...club.events, response.data.event] });
            setSuccess('Event added successfully');
            setEventForm({ name: '', description: '', date: '', venue: '', googleFormLink: '' });
            setShowAddEvent(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add event');
        }
    };

    const handleDeleteEvent = (eventId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Event',
            message: 'Are you sure you want to delete this event? This action cannot be undone.',
            onConfirm: async () => {
                setError('');
                setSuccess('');

                try {
                    await api.delete(`/club/events/${eventId}`);
                    setClub({ ...club, events: club.events.filter(e => e._id !== eventId) });
                    setSuccess('Event deleted successfully');
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to delete event');
                }
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleDeleteClub = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Club Account',
            message: 'Are you absolutely sure you want to delete your club account? This will permanently delete all your club data including members and events. This action cannot be undone.',
            onConfirm: async () => {
                setError('');
                setSuccess('');
                setLoading(true);

                try {
                    await api.delete('/club/delete-account');
                    setSuccess('Club account deleted successfully. Redirecting...');
                    setTimeout(() => {
                        logout();
                        navigate('/');
                    }, 2000);
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to delete club account');
                    setLoading(false);
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 overflow-y-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="glass-card p-4 sm:p-6 mb-8 animate-fade-in">
                        <div className="flex items-center flex-wrap gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                                {club?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl font-bold text-[#666b5e] mb-2 truncate">{club?.name}</h1>
                                <p className="text-[#7d6b57] mt-1 text-sm sm:text-base truncate">{club?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Error/Success Messages */}
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

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 min-h-[44px] text-sm sm:text-base ${activeTab === 'profile'
                                ? 'bg-white text-primary-600 shadow-lg'
                                : 'bg-white/50 text-gray-700 hover:bg-white/70'
                                }`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 min-h-[44px] text-sm sm:text-base ${activeTab === 'members'
                                ? 'bg-white text-primary-600 shadow-lg'
                                : 'bg-white/50 text-gray-700 hover:bg-white/70'
                                }`}
                        >
                            Members ({club?.members?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 min-h-[44px] text-sm sm:text-base ${activeTab === 'events'
                                ? 'bg-white text-primary-600 shadow-lg'
                                : 'bg-white/50 text-gray-700 hover:bg-white/70'
                                }`}
                        >
                            Events ({club?.events?.length || 0})
                        </button>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="glass-card p-8 animate-slide-up">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#666b5e]">Club Profile</h2>
                                {!editingProfile && (
                                    <button
                                        onClick={() => setEditingProfile(true)}
                                        className="btn-secondary"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {editingProfile ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#666b5e] mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            rows="6"
                                            className="input-field resize-none"
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        <button type="submit" className="btn-primary">
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingProfile(false);
                                                setDescription(club.description);
                                            }}
                                            className="btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                                    <p className="text-[#666b5e] whitespace-pre-wrap">{club?.description}</p>
                                </div>
                            )}

                            {/* Danger Zone */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[#666b5e] mb-2">Delete Club Account</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Once you delete your club account, there is no going back. This will permanently delete your club, all members, and all events.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDeleteClub}
                                        disabled={loading}
                                        className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                                    >
                                        Delete Club Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <div className="animate-slide-up">
                            <div className="glass-card p-6 mb-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-[#666b5e]">Members</h2>
                                    <button
                                        onClick={() => setShowAddMember(!showAddMember)}
                                        className="btn-primary"
                                    >
                                        {showAddMember ? 'Cancel' : 'Add Member'}
                                    </button>
                                </div>

                                {showAddMember && (
                                    <form onSubmit={handleAddMember} className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={memberForm.name}
                                                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                                                required
                                                className="input-field"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Role"
                                                value={memberForm.role}
                                                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                                                required
                                                className="input-field"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={memberForm.email}
                                                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                                                required
                                                className="input-field"
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary">
                                            Add Member
                                        </button>
                                    </form>
                                )}
                            </div>

                            {club?.members?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {club.members.map((member) => (
                                        <div key={member._id} className="card p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#666b5e]">{member.name}</h3>
                                                        <p className="text-sm text-[#7d6b57]">{member.role}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteMember(member._id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600">{member.email}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-12 text-center">
                                    <p className="text-[#666b5e] text-lg">No members added yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <div className="animate-slide-up">
                            <div className="glass-card p-6 mb-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-[#666b5e] mb-6">Events</h2>
                                    <button
                                        onClick={() => setShowAddEvent(!showAddEvent)}
                                        className="btn-primary"
                                    >
                                        {showAddEvent ? 'Cancel' : 'Add Event'}
                                    </button>
                                </div>

                                {showAddEvent && (
                                    <form onSubmit={handleAddEvent} className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                                        <input
                                            type="text"
                                            placeholder="Event Name"
                                            value={eventForm.name}
                                            onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                                            required
                                            className="input-field"
                                        />
                                        <textarea
                                            placeholder="Event Description"
                                            value={eventForm.description}
                                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                            required
                                            rows="3"
                                            className="input-field resize-none"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="date"
                                                value={eventForm.date}
                                                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                                                required
                                                className="input-field"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Venue"
                                                value={eventForm.venue}
                                                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                                                required
                                                className="input-field"
                                            />
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="Google Form Link"
                                            value={eventForm.googleFormLink}
                                            onChange={(e) => setEventForm({ ...eventForm, googleFormLink: e.target.value })}
                                            required
                                            className="input-field"
                                        />
                                        <button type="submit" className="btn-primary">
                                            Add Event
                                        </button>
                                    </form>
                                )}
                            </div>

                            {club?.events?.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    {club.events.map((event) => (
                                        <div key={event._id} className="card p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold text-[#666b5e]">{event.name}</h3>
                                                <button
                                                    onClick={() => handleDeleteEvent(event._id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className="text-[#666b5e] mb-3">{event.description}</p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center text-[#7d6b57]">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(event.date)}
                                                </div>
                                                <div className="flex items-center text-[#7d6b57]">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {event.venue}
                                                </div>
                                            </div>
                                            <a
                                                href={event.googleFormLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                                            >
                                                View Google Form
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-12 text-center">
                                    <p className="text-[#666b5e] text-lg">No events added yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default ClubDashboard;

