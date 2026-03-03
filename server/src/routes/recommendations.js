const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// ── GET /api/results/:id/recommendations ─────────────────────
router.get('/:id/recommendations', (req, res) => {
    const db = getDb();

    // Verify the result belongs to the current user
    const result = db.prepare('SELECT id FROM lab_results WHERE id = ? AND user_id = ?')
        .get(req.params.id, req.user.id);

    if (!result) {
        return res.status(404).json({ error: 'Result not found' });
    }

    const recommendations = db.prepare('SELECT * FROM recommendations WHERE result_id = ?')
        .all(req.params.id);

    res.json(recommendations.map(r => ({
        id: r.id,
        type: r.type,
        icon: r.icon,
        specialty: r.specialty,
        title: r.title,
        reason: r.reason,
        description: r.description,
        urgency: r.urgency,
    })));
});

module.exports = router;
