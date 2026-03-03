const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('./database');

async function seed() {
    const db = getDb();
    console.log('🌱 Seeding database...');

    // ── Demo user ────────────────────────────────────────────
    const demoEmail = 'demo@labscanner.com';
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(demoEmail);

    if (existing) {
        console.log('ℹ️  Demo user already exists, skipping seed.');
        return;
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash('demo123', 10);

    db.prepare('INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(userId, 'Alex Johnson', demoEmail, passwordHash, '2025-06-15T00:00:00Z');

    console.log('✅ Demo user created');

    // ── Helper ───────────────────────────────────────────────
    const insertResult = db.prepare(`
    INSERT INTO lab_results (id, user_id, title, source, date, flag_count, total_tests, overall_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertValue = db.prepare(`
    INSERT INTO lab_values (id, result_id, name, value, unit, ref_range, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    const insertRisk = db.prepare(`
    INSERT INTO risk_scores (id, result_id, disease, risk, level)
    VALUES (?, ?, ?, ?, ?)
  `);
    const insertRec = db.prepare(`
    INSERT INTO recommendations (id, result_id, type, icon, specialty, title, reason, description, urgency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    // ── Result 1: Blood Panel – Complete ─────────────────────
    const r1 = uuidv4();
    insertResult.run(r1, userId, 'Blood Panel – Complete', 'Blood Panel – Complete', '2026-02-20', 4, 10, 'warning');

    const labValues = [
        { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', refRange: '12.0–17.5', status: 'normal' },
        { name: 'White Blood Cells', value: '11.8', unit: '×10³/µL', refRange: '4.5–11.0', status: 'warning' },
        { name: 'Platelets', value: '245', unit: '×10³/µL', refRange: '150–400', status: 'normal' },
        { name: 'Glucose (Fasting)', value: '128', unit: 'mg/dL', refRange: '70–100', status: 'critical' },
        { name: 'Total Cholesterol', value: '215', unit: 'mg/dL', refRange: '<200', status: 'warning' },
        { name: 'HDL Cholesterol', value: '52', unit: 'mg/dL', refRange: '>40', status: 'normal' },
        { name: 'LDL Cholesterol', value: '138', unit: 'mg/dL', refRange: '<100', status: 'warning' },
        { name: 'Triglycerides', value: '165', unit: 'mg/dL', refRange: '<150', status: 'warning' },
        { name: 'Creatinine', value: '0.9', unit: 'mg/dL', refRange: '0.7–1.3', status: 'normal' },
        { name: 'TSH', value: '2.1', unit: 'mIU/L', refRange: '0.4–4.0', status: 'normal' },
    ];
    for (const v of labValues) {
        insertValue.run(uuidv4(), r1, v.name, v.value, v.unit, v.refRange, v.status);
    }

    const riskScores = [
        { disease: 'Type 2 Diabetes', risk: 0.72, level: 'high' },
        { disease: 'Cardiovascular Disease', risk: 0.45, level: 'moderate' },
        { disease: 'Thyroid Disorder', risk: 0.08, level: 'low' },
        { disease: 'Anemia', risk: 0.05, level: 'low' },
        { disease: 'Kidney Disease', risk: 0.12, level: 'low' },
    ];
    for (const s of riskScores) {
        insertRisk.run(uuidv4(), r1, s.disease, s.risk, s.level);
    }

    const recs = [
        { type: 'doctor', icon: 'medkit', specialty: 'Endocrinologist', reason: 'Elevated fasting glucose indicates potential pre-diabetes. An endocrinologist can provide a thorough metabolic evaluation.', urgency: 'high' },
        { type: 'doctor', icon: 'heart', specialty: 'Cardiologist', reason: 'Elevated cholesterol and triglycerides increase cardiovascular risk. A cardiologist can assess your heart health.', urgency: 'moderate' },
        { type: 'doctor', icon: 'nutrition', specialty: 'Nutritionist / Dietitian', reason: 'Dietary modifications can help manage glucose and lipid levels. A specialist can create a personalized plan.', urgency: 'moderate' },
        { type: 'lifestyle', icon: 'walk', title: 'Increase Physical Activity', description: 'Aim for at least 150 minutes of moderate aerobic exercise per week. Walking, swimming, or cycling can improve glucose metabolism and lipid profiles.' },
        { type: 'lifestyle', icon: 'restaurant', title: 'Adopt a Balanced Diet', description: 'Focus on whole grains, lean proteins, fruits, and vegetables. Limit refined sugars, saturated fats, and processed foods.' },
        { type: 'lifestyle', icon: 'water', title: 'Stay Hydrated', description: 'Drink at least 8 glasses of water daily. Adequate hydration supports kidney function and metabolic processes.' },
        { type: 'lifestyle', icon: 'bed', title: 'Prioritize Sleep', description: 'Aim for 7–9 hours of quality sleep each night. Poor sleep is linked to insulin resistance and cardiovascular stress.' },
    ];
    for (const r of recs) {
        insertRec.run(uuidv4(), r1, r.type, r.icon || null, r.specialty || null, r.title || null, r.reason || null, r.description || null, r.urgency || null);
    }

    console.log('✅ Result 1: Blood Panel – Complete');

    // ── Result 2: Lipid Panel ────────────────────────────────
    const r2 = uuidv4();
    insertResult.run(r2, userId, 'Lipid Panel', 'Lipid Panel', '2026-01-10', 2, 5, 'warning');

    const lipidValues = [
        { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', refRange: '<200', status: 'warning' },
        { name: 'HDL Cholesterol', value: '48', unit: 'mg/dL', refRange: '>40', status: 'normal' },
        { name: 'LDL Cholesterol', value: '130', unit: 'mg/dL', refRange: '<100', status: 'warning' },
        { name: 'Triglycerides', value: '142', unit: 'mg/dL', refRange: '<150', status: 'normal' },
        { name: 'VLDL Cholesterol', value: '28', unit: 'mg/dL', refRange: '5–40', status: 'normal' },
    ];
    for (const v of lipidValues) {
        insertValue.run(uuidv4(), r2, v.name, v.value, v.unit, v.refRange, v.status);
    }
    console.log('✅ Result 2: Lipid Panel');

    // ── Result 3: Complete Blood Count ───────────────────────
    const r3 = uuidv4();
    insertResult.run(r3, userId, 'Complete Blood Count', 'Complete Blood Count', '2025-11-05', 0, 8, 'normal');

    const cbcValues = [
        { name: 'Red Blood Cells', value: '4.9', unit: '×10⁶/µL', refRange: '4.5–5.5', status: 'normal' },
        { name: 'White Blood Cells', value: '7.2', unit: '×10³/µL', refRange: '4.5–11.0', status: 'normal' },
        { name: 'Hemoglobin', value: '15.1', unit: 'g/dL', refRange: '12.0–17.5', status: 'normal' },
        { name: 'Hematocrit', value: '44', unit: '%', refRange: '36–54', status: 'normal' },
        { name: 'Platelets', value: '260', unit: '×10³/µL', refRange: '150–400', status: 'normal' },
        { name: 'MCV', value: '88', unit: 'fL', refRange: '80–100', status: 'normal' },
        { name: 'MCH', value: '30', unit: 'pg', refRange: '27–33', status: 'normal' },
        { name: 'MCHC', value: '34', unit: 'g/dL', refRange: '32–36', status: 'normal' },
    ];
    for (const v of cbcValues) {
        insertValue.run(uuidv4(), r3, v.name, v.value, v.unit, v.refRange, v.status);
    }
    console.log('✅ Result 3: Complete Blood Count');

    // ── Result 4: Metabolic Panel ────────────────────────────
    const r4 = uuidv4();
    insertResult.run(r4, userId, 'Metabolic Panel', 'Metabolic Panel', '2025-08-22', 1, 7, 'normal');

    const metValues = [
        { name: 'Glucose', value: '105', unit: 'mg/dL', refRange: '70–100', status: 'warning' },
        { name: 'BUN', value: '15', unit: 'mg/dL', refRange: '7–20', status: 'normal' },
        { name: 'Creatinine', value: '1.0', unit: 'mg/dL', refRange: '0.7–1.3', status: 'normal' },
        { name: 'Sodium', value: '140', unit: 'mEq/L', refRange: '136–145', status: 'normal' },
        { name: 'Potassium', value: '4.2', unit: 'mEq/L', refRange: '3.5–5.0', status: 'normal' },
        { name: 'Calcium', value: '9.5', unit: 'mg/dL', refRange: '8.5–10.5', status: 'normal' },
        { name: 'CO2', value: '24', unit: 'mEq/L', refRange: '23–29', status: 'normal' },
    ];
    for (const v of metValues) {
        insertValue.run(uuidv4(), r4, v.name, v.value, v.unit, v.refRange, v.status);
    }
    console.log('✅ Result 4: Metabolic Panel');

    // ── Result 5: Thyroid Function Test ──────────────────────
    const r5 = uuidv4();
    insertResult.run(r5, userId, 'Thyroid Function Test', 'Thyroid Function Test', '2025-06-15', 0, 3, 'normal');

    const thyroidValues = [
        { name: 'TSH', value: '2.3', unit: 'mIU/L', refRange: '0.4–4.0', status: 'normal' },
        { name: 'Free T4', value: '1.2', unit: 'ng/dL', refRange: '0.8–1.8', status: 'normal' },
        { name: 'Free T3', value: '3.1', unit: 'pg/mL', refRange: '2.3–4.2', status: 'normal' },
    ];
    for (const v of thyroidValues) {
        insertValue.run(uuidv4(), r5, v.name, v.value, v.unit, v.refRange, v.status);
    }
    console.log('✅ Result 5: Thyroid Function Test');

    console.log('\n🎉 Seed complete! Demo account ready.');
    console.log('   Email:    demo@labscanner.com');
    console.log('   Password: demo123');
}

seed().catch(console.error);
