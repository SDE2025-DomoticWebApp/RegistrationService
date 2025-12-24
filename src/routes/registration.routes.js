const express = require('express');
const router = express.Router();
const regService = require('../services/registration.services');

// POST /register
router.post('/', async (req, res) => {
    const { email, name, surname, password } = req.body;

    if (!email || !name || !surname || !password) {
        return res.status(400).json({ error: 'Email, name, surname and password required' });
    }

    try {
        await regService.register({ email, name, surname, password });
        res.status(201).end();
    } catch (err) {
        if (err.message === 'INVALID_REGISTRATION') {
            return res.status(401).json({ error: 'Invalid registration' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
