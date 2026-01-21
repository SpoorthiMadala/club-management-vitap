import express from 'express';
import Club from '../models/Club.js';

const router = express.Router();

// Get all verified clubs
router.get('/clubs', async (req, res) => {
    try {
        const clubs = await Club.find({ verified: true })
            .select('-password -verified')
            .sort({ createdAt: -1 });

        res.json({ success: true, clubs });
    } catch (error) {
        console.error('Get clubs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching clubs',
            error: error.message
        });
    }
});

// Get club details by ID
router.get('/clubs/:clubId', async (req, res) => {
    try {
        const { clubId } = req.params;

        const club = await Club.findOne({ _id: clubId, verified: true })
            .select('-password -verified');

        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        res.json({ success: true, club });
    } catch (error) {
        console.error('Get club details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching club details',
            error: error.message
        });
    }
});

// Get all events (ongoing and upcoming only, no completed events)
router.get('/events', async (req, res) => {
    try {
        const clubs = await Club.find({ verified: true })
            .select('name events')
            .sort({ createdAt: -1 });

        // Flatten events from all clubs and add club info
        const allEvents = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        clubs.forEach(club => {
            club.events.forEach(event => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);

                // Only include ongoing and upcoming events (not completed)
                if (eventDate >= today) {
                    allEvents.push({
                        ...event.toObject(),
                        clubId: club._id,
                        clubName: club.name
                    });
                }
            });
        });

        // Sort events by date
        allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json({ success: true, events: allEvents });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
});

// Get event details by ID
router.get('/events/:clubId/:eventId', async (req, res) => {
    try {
        const { clubId, eventId } = req.params;

        const club = await Club.findOne({ _id: clubId, verified: true })
            .select('name events');

        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club not found'
            });
        }

        const event = club.events.id(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            event: {
                ...event.toObject(),
                clubId: club._id,
                clubName: club.name
            }
        });
    } catch (error) {
        console.error('Get event details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching event details',
            error: error.message
        });
    }
});

export default router;
