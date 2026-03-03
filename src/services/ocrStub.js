// OCR Stub — replace with your real OCR model later
// Simulates processing an image and extracting lab text

export const processImage = async (uri) => {
    // Simulate network / processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return mock extracted text
    return {
        success: true,
        extractedText: `
      LABORATORY REPORT
      Patient: Alex Johnson
      Date: 2026-02-20

      Hemoglobin: 14.2 g/dL (Ref: 12.0-17.5)
      WBC: 11.8 ×10³/µL (Ref: 4.5-11.0) HIGH
      Platelets: 245 ×10³/µL (Ref: 150-400)
      Glucose (Fasting): 128 mg/dL (Ref: 70-100) HIGH
      Total Cholesterol: 215 mg/dL (Ref: <200) HIGH
      HDL: 52 mg/dL (Ref: >40)
      LDL: 138 mg/dL (Ref: <100) HIGH
      Triglycerides: 165 mg/dL (Ref: <150) HIGH
      Creatinine: 0.9 mg/dL (Ref: 0.7-1.3)
      TSH: 2.1 mIU/L (Ref: 0.4-4.0)
    `,
    };
};
