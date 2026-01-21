import express from 'express';
import { body, validationResult } from 'express-validator';
import Club from '../models/Club.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected with authMiddleware
router.use(authMiddleware);

// Get club profile
router.get('/profile', async (req, res) => {
    try {
        const club = await Club.findById(req.clubId).select('-password');
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        res.json({ success: true, club });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

// Update club profile (description only)
router.put('/profile', [
    body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { description } = req.body;

        const club = await Club.findByIdAndUpdate(
            req.clubId,
            { description },
            { new: true, runValidators: true }
        ).select('-password');

        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            club
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});

// Add member
router.post('/members', [
    body('name').trim().notEmpty().withMessage('Member name is required'),
    body('role').trim().notEmpty().withMessage('Member role is required'),
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, role, email } = req.body;

        const club = await Club.findById(req.clubId);
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        // Check if member already exists
        const memberExists = club.members.some(m => m.email === email);
        if (memberExists) {
            return res.status(400).json({
                success: false,
                message: 'Member with this email already exists'
            });
        }

        club.members.push({ name, role, email });
        await club.save();

        res.status(201).json({
            success: true,
            message: 'Member added successfully',
            member: club.members[club.members.length - 1]
        });
    } catch (error) {
        console.error('Add member error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding member',
            error: error.message
        });
    }
});

// Delete member
router.delete('/members/:memberId', async (req, res) => {
    try {
        const { memberId } = req.params;

        const club = await Club.findById(req.clubId);
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        const memberIndex = club.members.findIndex(m => m._id.toString() === memberId);
        if (memberIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        club.members.splice(memberIndex, 1);
        await club.save();

        res.json({
            success: true,
            message: 'Member deleted successfully'
        });
    } catch (error) {
        console.error('Delete member error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting member',
            error: error.message
        });
    }
});

// Add event
router.post('/events', [
    body('name').trim().notEmpty().withMessage('Event name is required'),
    body('description').trim().notEmpty().withMessage('Event description is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('venue').trim().notEmpty().withMessage('Venue is required'),
    body('googleFormLink').isURL().withMessage('Valid Google Form link is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, description, date, venue, googleFormLink } = req.body;

        const club = await Club.findById(req.clubId);
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        club.events.push({ name, description, date, venue, googleFormLink });
        await club.save();

        res.status(201).json({
            success: true,
            message: 'Event added successfully',
            event: club.events[club.events.length - 1]
        });
    } catch (error) {
        console.error('Add event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding event',
            error: error.message
        });
    }
});

// Delete event
router.delete('/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;

        const club = await Club.findById(req.clubId);
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        const eventIndex = club.events.findIndex(e => e._id.toString() === eventId);
        if (eventIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        club.events.splice(eventIndex, 1);
        await club.save();

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
});

// Delete Club Account
router.delete('/delete-account', async (req, res) => {
    try {
        const club = await Club.findById(req.clubId);
        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        // Delete the club (this will delete all associated members and events)
        await Club.findByIdAndDelete(req.clubId);

        res.json({
            success: true,
            message: 'Club account deleted successfully. All associated data has been removed.'
        });
    } catch (error) {
        console.error('Delete club error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting club account',
            error: error.message
        });
    }
});

export default router;
