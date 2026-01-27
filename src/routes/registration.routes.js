const express = require('express');
const router = express.Router();
const regService = require('../services/registration.services');

// POST /register
router.post('/', async (req, res) => {
    const { email, name, surname, password, location } = req.body;

    if (!email || !name || !surname || !password || !location) {
        return res.status(400).json({ error: 'Missing required fields: email, name, surname, password, location' });
    }

    try {
        console.log(`[Registration] Processing registration request for: ${email} at ${location}`);
        await regService.register({ email, name, surname, password, location });
        console.log(`[Registration] User registration completed for: ${email}`);
        res.status(201).end();
    } catch (err) {
        console.log(`[Registration] Registration failed for ${email}: ${err.message}`);
        if (err.message === 'INVALID_REGISTRATION') {
            return res.status(401).json({ error: 'Invalid registration' });
        }
        if (err.message === 'USER_EXISTS') {
            return res.status(409).json({ error: 'User already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
