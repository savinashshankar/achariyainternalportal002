// Admissions Configuration - Centralized dropdown values

export const ADMISSIONS_CONFIG = {
    grades: [
        "LKG",
        "UKG",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
    ],

    academicYears: [
        "2025-26",
        "2026-27",
    ],

    campuses: [
        "Campus 1",
        "Campus 2",
        "Campus 3",
    ], // TODO: Update with actual campus names

    leadSources: [
        "Walk-in",
        "Phone",
        "WhatsApp",
        "Website",
        "Google Form",
        "Referral",
        "Campaign",
        "Other",
    ],

    contactTimes: [
        "Morning (9 AM - 12 PM)",
        "Afternoon (12 PM - 4 PM)",
        "Evening (4 PM - 7 PM)",
        "Any time",
    ],

    languages: [
        "English",
        "Tamil",
        "Hindi",
        "Other",
    ],

    statuses: [
        "New",
        "Contacted",
        "Visit Scheduled",
        "Visit Done",
        "Decision Pending",
        "Converted",
        "Not Interested",
        "Closed",
    ] as const,
};

// Status color mapping for UI
export const STATUS_COLORS: Record<string, string> = {
    "New": "bg-blue-100 text-blue-800",
    "Contacted": "bg-purple-100 text-purple-800",
    "Visit Scheduled": "bg-yellow-100 text-yellow-800",
    "Visit Done": "bg-orange-100 text-orange-800",
    "Decision Pending": "bg-pink-100 text-pink-800",
    "Converted": "bg-green-100 text-green-800",
    "Not Interested": "bg-gray-100 text-gray-800",
    "Closed": "bg-red-100 text-red-800",
};

// Feature flags
export const ADMISSIONS_FEATURES = {
    USE_MOCK_DATA: true,              // Toggle for development
    ENABLE_GOOGLE_SHEETS: false,      // Phase 2
    ENABLE_FIREBASE: false,           // Phase 3
    SHOW_SLA_BREACHES: true,
    ENABLE_LEAD_ASSIGNMENT: false,    // Phase 2
};

// SLA Configuration (in minutes)
export const SLA_CONFIG = {
    FIRST_CONTACT_THRESHOLD: 30,      // 30 minutes to first contact
    FOLLOWUP_THRESHOLD: 1440,         // 24 hours for follow-up
};

// Webhook URL (placeholder for Google Sheets integration)
export const WEBHOOK_URL = "PUT_WEBHOOK_URL_HERE";
