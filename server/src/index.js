const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const resultsRoutes = require('./routes/results');
const recommendationsRoutes = require('./routes/recommendations');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`${req.method} ${req.url} ${res.statusCode} ${ms}ms`);
    });
    next();
});

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/results', recommendationsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error Handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 LabScanner API running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
