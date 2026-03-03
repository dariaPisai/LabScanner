const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

// ── GET /api/results ─────────────────────────────────────────
// List all lab results for the current user (history view)
router.get('/', (req, res) => {
    const db = getDb();
    const results = db.prepare(`
    SELECT id, title, source, date, flag_count, total_tests, overall_status, created_at
    FROM lab_results
    WHERE user_id = ?
    ORDER BY date DESC
  `).all(req.user.id);

    res.json(results.map(r => ({
        id: r.id,
        title: r.title,
        source: r.source,
        date: r.date,
        flagCount: r.flag_count,
        totalTests: r.total_tests,
        overallStatus: r.overall_status,
    })));
});

// ── GET /api/results/:id ─────────────────────────────────────
// Get full result with lab values and risk scores
router.get('/:id', (req, res) => {
    const db = getDb();
    const result = db.prepare(`
    SELECT * FROM lab_results WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.id);

    if (!result) {
        return res.status(404).json({ error: 'Result not found' });
    }

    const values = db.prepare('SELECT * FROM lab_values WHERE result_id = ?').all(req.params.id);
    const riskScores = db.prepare('SELECT * FROM risk_scores WHERE result_id = ?').all(req.params.id);

    res.json({
        id: result.id,
        date: result.date,
        source: result.source || result.title,
        values: values.map(v => ({
            name: v.name,
            value: v.value,
            unit: v.unit,
            refRange: v.ref_range,
            status: v.status,
        })),
        riskScores: riskScores.map(s => ({
            disease: s.disease,
            risk: s.risk,
            level: s.level,
        })),
    });
});

// ── POST /api/results ────────────────────────────────────────
// Save a new lab result (from scan/upload)
router.post(
    '/',
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('date').notEmpty().withMessage('Date is required'),
        body('values').isArray({ min: 1 }).withMessage('At least one lab value is required'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, source, date, values, riskScores, recommendations } = req.body;
        const db = getDb();
        const resultId = uuidv4();

        // Count flagged values
        const flagCount = values.filter(v => v.status !== 'normal').length;
        const totalTests = values.length;
        const overallStatus = values.some(v => v.status === 'critical')
            ? 'critical'
            : flagCount > 0
                ? 'warning'
                : 'normal';

        // Insert result
        db.prepare(`
      INSERT INTO lab_results (id, user_id, title, source, date, flag_count, total_tests, overall_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(resultId, req.user.id, title, source || title, date, flagCount, totalTests, overallStatus);

        // Insert lab values
        const insertValue = db.prepare(`
      INSERT INTO lab_values (id, result_id, name, value, unit, ref_range, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        for (const v of values) {
            insertValue.run(uuidv4(), resultId, v.name, v.value, v.unit, v.refRange, v.status || 'normal');
        }

        // Insert risk scores if provided
        if (riskScores && riskScores.length > 0) {
            const insertRisk = db.prepare(`
        INSERT INTO risk_scores (id, result_id, disease, risk, level)
        VALUES (?, ?, ?, ?, ?)
      `);
            for (const s of riskScores) {
                insertRisk.run(uuidv4(), resultId, s.disease, s.risk, s.level);
            }
        }

        // Insert recommendations if provided
        if (recommendations && recommendations.length > 0) {
            const insertRec = db.prepare(`
        INSERT INTO recommendations (id, result_id, type, icon, specialty, title, reason, description, urgency)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            for (const r of recommendations) {
                insertRec.run(
                    uuidv4(), resultId, r.type, r.icon || null, r.specialty || null,
                    r.title || null, r.reason || null, r.description || null, r.urgency || null
                );
            }
        }

        res.status(201).json({
            id: resultId,
            title,
            date,
            flagCount,
            totalTests,
            overallStatus,
        });
    }
);

// ── DELETE /api/results/:id ──────────────────────────────────
router.delete('/:id', (req, res) => {
    const db = getDb();
    const result = db.prepare('SELECT id FROM lab_results WHERE id = ? AND user_id = ?')
        .get(req.params.id, req.user.id);

    if (!result) {
        return res.status(404).json({ error: 'Result not found' });
    }

    db.prepare('DELETE FROM lab_results WHERE id = ?').run(req.params.id);

    res.json({ message: 'Result deleted' });
});

module.exports = router;
