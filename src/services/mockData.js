// Mock data for the LabScanner app
// Replace with real API calls / model outputs later

export const mockUser = {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    avatar: null,
    memberSince: '2025-06-15',
};

export const mockLabResults = {
    id: 'result-001',
    date: '2026-02-20',
    source: 'Blood Panel – Complete',
    values: [
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
    ],
    riskScores: [
        { disease: 'Type 2 Diabetes', risk: 0.72, level: 'high' },
        { disease: 'Cardiovascular Disease', risk: 0.45, level: 'moderate' },
        { disease: 'Thyroid Disorder', risk: 0.08, level: 'low' },
        { disease: 'Anemia', risk: 0.05, level: 'low' },
        { disease: 'Kidney Disease', risk: 0.12, level: 'low' },
    ],
};

export const mockRecommendations = [
    {
        id: 'rec-1',
        type: 'doctor',
        icon: 'medkit',
        specialty: 'Endocrinologist',
        reason: 'Elevated fasting glucose indicates potential pre-diabetes. An endocrinologist can provide a thorough metabolic evaluation.',
        urgency: 'high',
    },
    {
        id: 'rec-2',
        type: 'doctor',
        icon: 'heart',
        specialty: 'Cardiologist',
        reason: 'Elevated cholesterol and triglycerides increase cardiovascular risk. A cardiologist can assess your heart health.',
        urgency: 'moderate',
    },
    {
        id: 'rec-3',
        type: 'doctor',
        icon: 'nutrition',
        specialty: 'Nutritionist / Dietitian',
        reason: 'Dietary modifications can help manage glucose and lipid levels. A specialist can create a personalized plan.',
        urgency: 'moderate',
    },
    {
        id: 'rec-4',
        type: 'lifestyle',
        icon: 'walk',
        title: 'Increase Physical Activity',
        description: 'Aim for at least 150 minutes of moderate aerobic exercise per week. Walking, swimming, or cycling can improve glucose metabolism and lipid profiles.',
    },
    {
        id: 'rec-5',
        type: 'lifestyle',
        icon: 'restaurant',
        title: 'Adopt a Balanced Diet',
        description: 'Focus on whole grains, lean proteins, fruits, and vegetables. Limit refined sugars, saturated fats, and processed foods.',
    },
    {
        id: 'rec-6',
        type: 'lifestyle',
        icon: 'water',
        title: 'Stay Hydrated',
        description: 'Drink at least 8 glasses of water daily. Adequate hydration supports kidney function and metabolic processes.',
    },
    {
        id: 'rec-7',
        type: 'lifestyle',
        icon: 'bed',
        title: 'Prioritize Sleep',
        description: 'Aim for 7–9 hours of quality sleep each night. Poor sleep is linked to insulin resistance and cardiovascular stress.',
    },
];

export const mockHistory = [
    {
        id: 'result-001',
        date: '2026-02-20',
        title: 'Blood Panel – Complete',
        flagCount: 4,
        totalTests: 10,
        overallStatus: 'warning',
    },
    {
        id: 'result-002',
        date: '2026-01-10',
        title: 'Lipid Panel',
        flagCount: 2,
        totalTests: 5,
        overallStatus: 'warning',
    },
    {
        id: 'result-003',
        date: '2025-11-05',
        title: 'Complete Blood Count',
        flagCount: 0,
        totalTests: 8,
        overallStatus: 'normal',
    },
    {
        id: 'result-004',
        date: '2025-08-22',
        title: 'Metabolic Panel',
        flagCount: 1,
        totalTests: 7,
        overallStatus: 'normal',
    },
    {
        id: 'result-005',
        date: '2025-06-15',
        title: 'Thyroid Function Test',
        flagCount: 0,
        totalTests: 3,
        overallStatus: 'normal',
    },
];
