const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../db/database');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// ── POST /api/auth/register ──────────────────────────────────
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        const db = getDb();

        // Check if email exists
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const id = uuidv4();
        const passwordHash = await bcrypt.hash(password, 10);

        db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)')
            .run(id, name, email, passwordHash);

        const token = jwt.sign({ id, name, email }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            token,
            user: { id, name, email, memberSince: new Date().toISOString().slice(0, 10) },
        });
    }
);

// ── POST /api/auth/login ─────────────────────────────────────
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const db = getDb();

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                memberSince: user.created_at.slice(0, 10),
            },
        });
    }
);

// ── GET /api/auth/me ─────────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
    const db = getDb();
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        memberSince: user.created_at.slice(0, 10),
    });
});

module.exports = router;
