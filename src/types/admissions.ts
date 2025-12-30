// Admissions Lead Management Types

export interface AdmissionsLead {
    // Auto-generated fields
    lead_id: string;              // Format: "AD-20251230-0001"
    created_at: Date;
    last_updated_at: Date;

    // Required fields
    student_name: string;
    grade_applying_for: string;
    parent_name: string;
    mobile_number: string;
    campus: string;
    lead_source: string;

    // Optional fields
    email?: string;
    academic_year: string;        // Default: "2025-26"
    preferred_contact_time?: string;
    language_preference?: string;
    notes?: string;

    // Workflow fields
    status: LeadStatus;           // Default: "New"
    assigned_to?: string;
    first_contact_at?: Date;
    next_followup_at?: Date;

    // Analytics (future-ready)
    interaction_count: number;    // Default: 0
    stage_timestamps: Record<LeadStatus, Date | null>;
}

export type LeadStatus =
    | "New"
    | "Contacted"
    | "Visit Scheduled"
    | "Visit Done"
    | "Decision Pending"
    | "Converted"
    | "Not Interested"
    | "Closed";

export interface Lead KPIs {
    total_leads: number;
    leads_today: number;
    leads_this_week: number;
    new_count: number;
    contacted_count: number;
    converted_count: number;
    sla_breaches: number;
}

export interface LeadFilters {
    date_range?: {
        start: Date;
        end: Date;
    };
    campus?: string;
    source?: string;
    status?: LeadStatus;
    search_query?: string;
}
